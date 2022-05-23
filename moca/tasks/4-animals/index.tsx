import { Stack, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import MocaPageWrapper from 'features/moca/wrapper';
import useMediaRecorder from 'hooks/useMediaRecorder';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { PhotoContainer } from './controls/animals-photo/styled';
import { Animal } from './store';

export const MocaAnimals = observer(() => {
  const mocaStore = useMocaStore();
  const nextTask = useNextTaskDelay(0);
  const store = useStoreWithSpeech(Animal);
  const { t } = useTranslation();

  const { startRecord, stopRecord } = useMediaRecorder();

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  useEffect(() => {
    playAudio('M04D_0').finally(() => {
      store.timer.start();
      store.speech.start();
    });
  }, []);

  useEffect(() => {
    if (store.currentCard >= 0 && store.currentCard <= 2) {
      startRecord();
    }
  }, [store.currentCard]);

  useEffect(() => {
    if (store.finish) {
      nextTask();
    }
  }, [store.finish]);

  const sendData = async () => {
    const result = await stopRecord();
    console.log('send');
    mocaStore.sendAnswer({
      questionNumber: store.questionNumber,

      answer: store.speech.alternative?.text ?? '',
      file: result,
      questionUUID: store.data?.[store.currentCard]?.uuid,
      context: store.data?.[store.currentCard].correctAnswer,
    });
  };

  useEffect(() => {
    if (store.isCorrectLastWord && store.currentCard < 3) {
      sendData();
      store.waitNextCard();
    }
  }, [store.lastWord]);

  return (
    <MocaPageWrapper
      serverError={store.speech.serverError}
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={t('moca:title.4')}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => {
        if (store.data && store.currentCard < 3) {
          sendData();
          store.nextCard();
        }
      }}
    >
      <Stack alignItems='center'>
        <Stack spacing='1rem'>
          <PhotoContainer width='16rem'>
            <img src={store?.data?.[store.currentCard]?.fileLink} alt='' draggable='false' />
          </PhotoContainer>
          <TaskContext
            p='1.5rem 1rem'
            sx={{
              borderColor: isAudioPlaying ? 'transparent' : 'primary.main',
              borderStyle: isAudioPlaying || store.isWaitNextCard ? null : 'dashed',
            }}
          >
            <Typography
              fontSize='1.3rem'
              fontWeight='500'
              textTransform='capitalize'
              lineHeight={0}
            >
              {store.lastWord || ''}
            </Typography>
          </TaskContext>
        </Stack>
      </Stack>
    </MocaPageWrapper>
  );
});
