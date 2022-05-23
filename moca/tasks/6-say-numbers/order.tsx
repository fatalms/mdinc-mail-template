import ArrowBack from '@mui/icons-material/ArrowBackIosNewRounded';
import { Stack, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStore } from 'features/moca/store/provider';

import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import MocaPageWrapper from 'features/moca/wrapper';
import useMediaRecorder from 'hooks/useMediaRecorder';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { NumberVariant } from '.';
import { SayNumbers } from './store';

interface BasicNumbersProps {
  nextStage: (delay?: number) => void;
  variant: NumberVariant;
}

const audio: { [key in BasicNumbersProps['variant']]: string } = {
  direct: 'M06D_0',
  revert: 'M06D_1',
};

const header: { [key in BasicNumbersProps['variant']]: React.ReactNode } = {
  direct: 'Прослушайте ряд чисел. Назовите их в той же последовательности',
  revert: (
    <>
      Прослушайте ряд чисел. Назовите их <span>в обратном порядке</span>
    </>
  ),
};

const numbers: { [key in BasicNumbersProps['variant']]: number } = { direct: 5, revert: 3 };

export const Order = observer(({ nextStage, variant }: BasicNumbersProps) => {
  const mocaStore = useMocaStore();
  const store = useStoreWithSpeech(SayNumbers, numbers[variant]);

  const { startRecord, stopRecord } = useMediaRecorder();

  const completeTask = (delay?: number) => {
    store.timer.pause();
    sendData();
    nextStage(delay);
  };

  useEffect(() => {
    console.log(`%cstore.words`, 'color: blue', store.words);
  }, [store.words]);

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  const sendData = async () => {
    const result = await stopRecord();
    await mocaStore.sendAnswer({
      questionNumber: store.questionNumber,
      context: JSON.stringify({
        reverse: variant === 'revert',
        numbers: store.correctAnswer,
      }),

      answer: store.speech.alternative?.text ?? '',
      file: result,
    });
  };

  useEffect(() => {
    if (store.isFullAnswer) {
      completeTask();
    }
  }, [store.isFullAnswer]);

  useEffect(() => {
    (async () => {
      await playAudio(audio[variant]);

      for (let i = 0; i < store.correctAnswer.length; i++) {
        await playAudio(`M06C_${store.correctAnswer[i]}`);
      }
    })().finally(() => {
      store.timer.start();
      store.speech.start();
      startRecord();
    });
  }, [variant]);

  return (
    <MocaPageWrapper
      serverError={store.speech.serverError}
      timeLeft={store.timer.secondsLeft}
      level={store.questionNumber}
      header={header[variant]}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => {
        completeTask(0);
      }}
    >
      <Stack alignItems='center'>
        <TaskContext
          direction={variant === 'direct' ? 'row' : 'row-reverse'}
          spacing='1rem'
          border='none'
        >
          {store.userAnswer.map((value, i, arr) => {
            const inactive = isAudioPlaying || (i !== 0 && !arr[i - 1]);
            return (
              <React.Fragment key={i}>
                {i !== 0 && (
                  <ArrowBack
                    sx={{
                      color: '#ADADAD',
                      width: '0.8rem',
                      transform: variant === 'direct' ? 'rotateY(180deg)' : null,
                    }}
                  />
                )}
                <TaskContext
                  borderRadius='50%'
                  position='relative'
                  sx={{
                    aspectRatio: '1',
                    borderColor: inactive ? '#D5F1DF' : value ? null : 'primary.main',
                    borderStyle: inactive || value ? null : 'dashed',
                    bgcolor: inactive ? '#D5F1DF' : null,
                    boxShadow: inactive ? 'none' : null,
                  }}
                >
                  <Typography
                    variant='h6'
                    position='absolute'
                    top='50%'
                    left='50%'
                    fontSize='3.5rem'
                    fontWeight='500'
                    sx={{ transform: 'translate(-50%,-50%)' }}
                  >
                    {value}
                  </Typography>
                </TaskContext>
              </React.Fragment>
            );
          })}
        </TaskContext>
      </Stack>
    </MocaPageWrapper>
  );
});
