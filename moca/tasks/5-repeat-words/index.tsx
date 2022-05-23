import { Stack, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import MocaPageWrapper from 'features/moca/wrapper';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { Memory } from './store/';

const audio: { [key in RepeatWordsProps['variant']]: string } = {
  first: 'M05D_0',
  second: 'M12D_0',
};

const header: { [key in RepeatWordsProps['variant']]: React.ReactNode } = {
  first: 'Прослушайте и запомните набор слов, затем повторите их',
  second: 'Назовите слова, которые вам нужно было запомнить',
};

interface RepeatWordsProps {
  variant: 'first' | 'second';
  questionNumber: number;
}

export const RepeatWords = observer(({ variant, questionNumber }: RepeatWordsProps) => {
  const mocaStore = useMocaStore();
  const nextTask = useNextTaskDelay();
  const store = useStoreWithSpeech(Memory, questionNumber);

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  const sendData = async () => {
    await mocaStore.sendAnswer({
      questionNumber: store.questionNumber,

      answer: store.words?.map(({ word, isGuessed }) => (isGuessed ? word : '')).join(';') ?? '',
      questionUUID: store.data?.uuid,
      context: store.data?.words.join(';'),
    });
  };

  useEffect(() => {
    store.fetchTask(variant === 'second' ? mocaStore.testId : undefined);
  }, []);

  useEffect(() => {
    if (store.data) {
      playAudio(audio[variant])
        .then(() => {
          if (variant === 'first') {
            return playAudio(store.data?.fileLink ?? '');
          }
        })
        .then(() => {
          store.timer.start();
          store.speech.start();
        });
    }
  }, [store.data]);

  const completeTask = async (delay?: number) => {
    sendData();
    if (variant === 'first') {
      store.speech.reset();
      store.speech.stop();
      await playAudio('M05D_1', store.data?.fileLink ?? '');
    }
    nextTask(delay);
  };

  useEffect(() => {
    store.words?.forEach((item) => {
      if (store.speech.textWords?.includes(item.word)) {
        item.isGuessed = true;
      }
    });
  }, [store.speech.lastWord]);

  useEffect(() => {
    if (store.finish) {
      completeTask();
    }
  }, [store.finish]);

  return (
    <MocaPageWrapper
      serverError={store.speech.serverError}
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={header[variant]}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => {
        console.log('click');
        completeTask(0);
      }}
    >
      <Stack alignItems='center' spacing='1rem'>
        {store.words?.map(({ word, isGuessed }, i) => (
          <TaskContext
            key={i}
            maxWidth='20rem'
            width='100%'
            p='1.5rem 1rem'
            sx={{
              borderColor: isAudioPlaying ? 'transparent' : isGuessed ? '#E0E0E0' : 'primary.main',
              borderStyle: isAudioPlaying || isGuessed ? null : 'dashed',
            }}
          >
            <Typography fontSize='1.3rem' fontWeight='500' textAlign='center' lineHeight={0}>
              {isGuessed ? word : ''}
            </Typography>
          </TaskContext>
        ))}
      </Stack>
    </MocaPageWrapper>
  );
});
