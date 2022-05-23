import ArrowBack from '@mui/icons-material/ArrowBackIosNewRounded';
import { Stack } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import MocaPageWrapper from 'features/moca/wrapper';
import useMediaRecorder from 'hooks/useMediaRecorder';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { CustomTypography } from './CustomTypography';
import { Span } from './Span';
import { Association } from './store';

export const MocaAbstraction = observer(() => {
  const mocaStore = useMocaStore();
  const nextTask = useNextTaskDelay();
  const store = useStoreWithSpeech(Association);

  const { startRecord, stopRecord } = useMediaRecorder();

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  const sendData = async () => {
    const result = await stopRecord();
    mocaStore.sendAnswer({
      questionNumber: store.questionNumber,
      answer: store.speech.alternative?.text,
      file: result,
      questionUUID: store.data?.uuid,
      context: store.data?.description,
    });
  };

  const completeTask = (delay?: number) => {
    sendData();
    nextTask(delay);
  };

  useEffect(() => {
    if (store.data) {
      playAudio('M11D_0', store.data.fileLink).finally(() => {
        store.speech.start();
        store.timer.start();
        startRecord();
      });
    }
  }, [store.data]);

  useEffect(() => {
    if (store.finish) {
      store.timer.pause();
      completeTask();
    }
  }, [store.finish]);

  return (
    <MocaPageWrapper
      serverError={store.speech.serverError}
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={'Назовите, что объединяет данные слова'}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => completeTask(0)}
    >
      <Stack spacing='1rem' alignItems='center'>
        <TaskContext border='none' py='1.5rem'>
          <CustomTypography>
            <Span width={`${(store.data?.maxSize || 0) * 0.7}rem`}>{store.data?.first}</Span>
            <Span sx={{ color: '#E0E0E0', fontSize: '1.5rem', px: '2rem' }}>|</Span>
            <Span width={`${(store.data?.maxSize || 0) * 0.7}rem`}>{store.data?.second}</Span>
          </CustomTypography>
        </TaskContext>
        <ArrowBack sx={{ transform: 'rotate(-90deg)', color: 'primary.main' }} />
        <TaskContext
          py='0.8rem'
          minWidth='30rem'
          maxWidth='80%'
          sx={{
            borderColor: isAudioPlaying ? 'transparent' : store.finish ? '#E0E0E0' : 'primary.main',
            borderStyle: isAudioPlaying || store.finish ? null : 'dashed',
          }}
        >
          <CustomTypography>{store.speech.alternative?.text || '\u00A0'}</CustomTypography>
        </TaskContext>
      </Stack>
    </MocaPageWrapper>
  );
});
