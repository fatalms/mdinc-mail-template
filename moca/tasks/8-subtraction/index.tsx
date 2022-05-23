import { Button, Stack, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStore } from 'features/moca/store/provider';
import MocaPageWrapper from 'features/moca/wrapper';
import { useStaticAudio } from 'hooks/useAudio';
import { useNextTask } from 'hooks/useNextTask';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from 'stores/hooks/useLocalStore';
import { Subtraction } from './store';

const AUDIO_NAME_PREFIX = 'MMSE03D';

export const MocaSubtraction = observer(() => {
  const mocaStore = useMocaStore();
  const store = useStore(Subtraction);

  const { playAudio, isAudioPlaying } = useStaticAudio({ startPlayFlag: true });
  const nextTask = useNextTask();

  useEffect(() => {
    playAudio(`${AUDIO_NAME_PREFIX}_0`).then(() => {
      store.timer.start();
    });

    return () => {
      store.timer.pause();
    };
  }, []);

  useEffect(() => {
    if (store.finish) {
      sendData();
      nextTask();
    }
  }, [store.finish]);

  const sendData = () => {
    mocaStore.sendAnswer({
      questionNumber: store.questionNumber,
      answer: store.userAnswer.join(';'),
      context: store.answerNumbers.join(';'),
    });
  };

  useEffect(() => {
    if (store.currentStage <= store.stageCount) {
      store.generateVariants();
    }
  }, [store.currentStage]);

  return (
    <MocaPageWrapper
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={'Решите примеры, выбрав правильный ответ'}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => {
        console.log('nex');
        store.setFinish();
      }}
    >
      <Stack spacing='3rem' alignItems='center' alignContent='center'>
        <Stack spacing='2rem' direction='row' alignItems='stretch'>
          <TaskContext border='none'>
            <Typography
              fontSize='2.5rem'
              fontWeight='500'
              sx={{ span: { color: 'primary.main', whiteSpace: 'break-spaces' } }}
            >
              {`${store.subtraction}`}
              <span>{` - ${store.subtrahend}`}</span>
            </Typography>
          </TaskContext>
          <Stack alignSelf='center' sx={{ aspectRatio: '1' }}>
            <Typography fontSize='2rem' fontWeight='500' textAlign='center'>
              {'='}
            </Typography>
          </Stack>
          <TaskContext
            sx={{
              borderColor: isAudioPlaying
                ? 'transparent'
                : store.currentAnswer
                ? '#E0E0E0'
                : 'primary.main',
              borderStyle: isAudioPlaying || store.currentAnswer ? null : 'dashed',
            }}
          >
            <Typography fontSize='2.5rem' fontWeight='500' minWidth='3rem' lineHeight='0'>
              {store.currentAnswer || ''}
            </Typography>
          </TaskContext>
        </Stack>
        <Stack direction='row' spacing='1rem' justifyContent='center'>
          {store.variants.map((variant, index) => (
            <TaskContext
              key={index}
              p={0}
              sx={{
                borderColor: 'transparent',
                aspectRatio: '1',
                ':hover': { border: '3px solid #767676' },
                ':active': {
                  bgcolor: '#767676',
                  border: '3px solid #767676',
                  transition: 'all 0.01s ease 0s',
                },
              }}
            >
              <Button
                disabled={store.currentAnswer < 0}
                onClick={() => store.pushUsersAnswer(store.variants[index])}
                disableElevation
                disableRipple
                sx={{ aspectRatio: '1' }}
              >
                <Typography variant='h5'>{variant}</Typography>
              </Button>
            </TaskContext>
          ))}
        </Stack>
      </Stack>
    </MocaPageWrapper>
  );
});
