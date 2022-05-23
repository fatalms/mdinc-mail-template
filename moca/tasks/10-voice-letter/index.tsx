import Cross from '@mui/icons-material/ClearRounded';
import { Box, Grid, List, ListItem, Stack, Typography, TypographyProps } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import MocaPageWrapper from 'features/moca/wrapper';
import useMediaRecorder from 'hooks/useMediaRecorder';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { VoiceLetter } from './store';

const clockRequires = [
  {
    type: 'имена собственные',
    explanation: 'Марина, Москва',
  },
  {
    type: 'числа',
    explanation: 'один, два, три',
  },
  {
    type: 'однокоренные слова',
    explanation: 'дом, домик, домовой',
  },
];

const CustomTypography = (props: TypographyProps) => (
  <Typography
    variant='subtitle2'
    fontWeight='500'
    lineHeight='1rem'
    whiteSpace='nowrap'
    {...props}
  />
);

export const TestVoiceLetter = observer(() => {
  const mocaStore = useMocaStore();
  const nextTask = useNextTaskDelay();
  const store = useStoreWithSpeech(VoiceLetter);

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  const { startRecord, stopRecord } = useMediaRecorder();

  const sendData = async () => {
    const result = await stopRecord();
    mocaStore.sendAnswer({
      questionNumber: store.questionNumber,
      context: store.letter,
      answer: store.speech.alternative?.text,
      file: result,
    });
  };

  const completeTask = (delay?: number) => {
    sendData();
    nextTask(delay);
  };

  useEffect(() => {
    playAudio('M10D_0', `M10C_${store.indexOfLetter}`).then(() => {
      store.speech.start();
      store.timer.start();
      startRecord();
    });
  }, []);

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
      header={
        <>
          Назовите как можно больше слов <span>на букву {store.letter.toUpperCase()}</span>. <br />{' '}
          Кроме имен собственных, чисел и однокоренных слов.
        </>
      }
      continueBtnDisabled={isAudioPlaying}
      onNext={() => completeTask(0)}
    >
      <Stack direction='row' spacing='2rem' px='2rem'>
        <Stack spacing='2rem' justifyContent='center'>
          <Box>
            <Typography variant='subtitle1' fontWeight='500' textTransform='uppercase'>
              заданная буква
            </Typography>
            <TaskContext border='none' px='1rem'>
              <Typography
                variant='subtitle1'
                fontWeight='500'
                sx={{ span: { color: 'primary.main', textTransform: 'uppercase' } }}
              >
                Слова на букву <span>{store.letter}</span>
              </Typography>
            </TaskContext>
          </Box>
          <Box>
            <Typography variant='subtitle1' fontWeight='500' textTransform='uppercase'>
              исключения
            </Typography>
            <TaskContext border='none' px='1rem'>
              <List dense={false}>
                {clockRequires.map(({ type, explanation }, i) => (
                  <ListItem key={i}>
                    <Stack direction='row' spacing='1rem' alignItems='center'>
                      <Cross
                        sx={{
                          borderRadius: '50%',
                          bgcolor: '#F59B31',
                          color: '#ffffff',
                          width: '0.85rem',
                          height: '0.85rem',
                        }}
                      />
                      <Box>
                        <CustomTypography>{type}</CustomTypography>
                        <CustomTypography color='#7D7D7D'>{explanation}</CustomTypography>
                      </Box>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </TaskContext>
          </Box>
        </Stack>
        <Grid container spacing={2}>
          {store.responded.map((word, i, arr) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <TaskContext
                p='1.5rem 3rem'
                sx={{
                  borderColor:
                    isAudioPlaying ||
                    (i !== 0 && !(arr[i - 1]?.length > 0) && !(arr[i + 1]?.length > 0))
                      ? 'transparent'
                      : word
                      ? '#E0E0E0'
                      : 'primary.main',
                  borderStyle: isAudioPlaying || word ? null : 'dashed',
                }}
              >
                <Typography lineHeight={0} fontWeight='500'>
                  {word}
                </Typography>
              </TaskContext>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </MocaPageWrapper>
  );
});
