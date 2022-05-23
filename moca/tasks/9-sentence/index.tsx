import { Stack, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStore } from 'features/moca/store/provider';

import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import MocaPageWrapper from 'features/moca/wrapper';
import useMediaRecorder from 'hooks/useMediaRecorder';
import { useNextTask } from 'hooks/useNextTask';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { Sentence } from './store';

export const MocaVoiceSentence = observer(() => {
  const mocaStore = useMocaStore();
  const nextTask = useNextTask();
  const store = useStoreWithSpeech(Sentence);
  const { t } = useTranslation();
  const { startRecord, stopRecord } = useMediaRecorder();

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  const sendData = async () => {
    const result = await stopRecord();
    mocaStore.sendAnswer({
      questionNumber: store.questionNumber,
      answer: store.speech.alternative?.text || ' ',
      file: result,
      questionUUID: store.data?.[store.currentCard].uuid,
      context: store.data?.[store.currentCard].description,
    });
  };

  useEffect(() => {
    console.log('store.currentLink:', store.currentLinks);
    if (store.canPlayAudio) {
      playAudio(...store.currentLinks).finally(() => {
        store.timer.start();
        store.speech.start();
        store.speech.setSilence(false);
        startRecord();
      });
    }
  }, [store.currentCard]);

  const completeTask = (delay?: number) => {
    if (store.nextCardTimeout) return;
    store.timer.pause();
    sendData();
    store.setNextCard(delay);
  };

  useEffect(() => {
    if (store.isCorrectAnswer) {
      completeTask();
    }
  }, [store.isCorrectAnswer]);

  useEffect(() => {
    if (store.finish) {
      nextTask();
    }
  }, [store.finish]);

  return (
    <MocaPageWrapper
      serverError={store.speech.serverError}
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={t('moca:title.9')}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => completeTask(0)}
    >
      <Stack spacing='0.5rem' width='90%' alignSelf='center'>
        <Typography fontWeight='500'>Предложение</Typography>
        <TaskContext
          py='0.75rem'
          sx={{
            borderColor: isAudioPlaying
              ? 'transparent'
              : store.isCorrectAnswer
              ? '#E0E0E0'
              : 'primary.main',
            borderStyle: isAudioPlaying || store.isCorrectAnswer ? null : 'dashed',
          }}
        >
          <Typography fontSize='1.3rem' fontWeight='500'>
            {store.speech.alternative?.text || '\u00A0'}
          </Typography>
        </TaskContext>
      </Stack>
    </MocaPageWrapper>
  );
});
