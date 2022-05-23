import { Box, Stack, Typography } from '@mui/material';
import { EmojiGrid } from 'features/cognitive/emoji/controls/grid';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import MocaPageWrapper from 'features/moca/wrapper';
import Lottie from 'lottie-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { useStore } from 'script/app/stores/hooks/useLocalStore';
import animationData from './animation.json';
import { Reaction } from './store';

export const Clap = observer(() => {
  const mocaStore = useMocaStore();
  const nextTask = useNextTaskDelay();
  const store = useStore(Reaction);
  const audio = useRef<HTMLAudioElement | null>(null);

  const { playAudio } = useMocaStaticAudio();

  useEffect(() => {
    const spacePressEvent = (e: KeyboardEvent) => {
      e.code === 'Space' && store.applyTiming();
    };
    if (store?.data?.fileLink) {
      document.addEventListener('keypress', spacePressEvent);
      playAudio('M07D_0').then(() => {
        store.updateCurrentWordTime();
        store.timer.start();
        audio.current?.play();
      });
    }
    return () => {
      document.removeEventListener('keypress', spacePressEvent);
    };
  }, [store?.data?.fileLink]);

  const sendData = async () => {
    await mocaStore.sendAnswer({
      questionNumber: store.questionNumber,

      questionUUID: store?.data?.uuid,
      context: store?.data?.targetChar,
      answer: store.timings.join(';'),
    });
  };

  const completeTask = (delay?: number) => {
    if (store.finish) return;
    store.setFinish();
    sendData();
    nextTask(delay);
  };

  useEffect(() => {
    if (store.timer.finished) {
      completeTask();
    }
  }, [store.timer.finished]);

  return (
    <MocaPageWrapper
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={
        <>
          Нажимайте на клавишу ПРОБЕЛ каждый раз, когда слышите <span>букву А</span>
        </>
      }
      continueBtnDisabled={false}
      onNext={() => {
        completeTask(0);
      }}
    >
      <audio
        ref={audio}
        src={store?.data?.fileLink}
        onTimeUpdate={(e) => {
          const biggestIndex =
            store.data?.targetTimestamps.findIndex(
              (item) => +item + 1400 > e.currentTarget.currentTime * 1000
            ) ?? -1;

          if (biggestIndex > store.currentSpace) {
            store.setCurrentSpace(biggestIndex);
          }
        }}
        onEnded={() => completeTask()}
      />
      <Stack minHeight='100%' spacing='1rem'>
        <Box flex='0 0 30%' pt='2rem'>
          <Lottie style={{ height: '10rem' }} animationData={animationData} />
        </Box>
        <EmojiGrid flex='0 0 auto' columns={5} rows={2} height='min-content'>
          {store.statuses.map((status, i) => (
            <TaskContext
              key={i}
              borderRadius='50%'
              alignSelf='center'
              justifySelf='center'
              position='relative'
              sx={{
                aspectRatio: '1',
                borderColor:
                  isNaN(store.startTime) || i > store.currentSpace
                    ? 'transparent'
                    : i === store.currentSpace
                    ? 'primary.main'
                    : '#E0E0E0',
                borderStyle: i === store.currentSpace && !status ? 'dashed' : null,
              }}
            >
              <Typography
                variant='h4'
                fontWeight='500'
                fontSize='3rem'
                position='absolute'
                top='50%'
                left='50%'
                sx={{ transform: 'translate(-50%,-50%)' }}
              >
                {status ? store.data?.targetChar : ''}
              </Typography>
            </TaskContext>
          ))}
        </EmojiGrid>
      </Stack>
    </MocaPageWrapper>
  );
});
