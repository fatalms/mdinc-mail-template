import { Stack, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import MocaPageWrapper from 'features/moca/wrapper';
import Lottie from 'lottie-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'script/app/stores/hooks/useLocalStore';
import animationData from './animation.json';
import { CircleSVG } from './control/circle/index';
import { BrokenLine } from './store';
import { correctAnswer } from './store/static';
import { Line } from './styled';

export const MocaBrokenLine = observer(() => {
  const mocaStore = useMocaStore();
  const store = useStore(BrokenLine);
  const { t } = useTranslation();

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });
  const nextTask = useNextTaskDelay();

  useEffect(() => {
    playAudio('M01D_0').finally(() => {
      store.timer.start();
    });
  }, []);

  useEffect(() => {
    if (store.finish) {
      store.timer.pause();
    }
  }, [store.finish]);

  const sendData = async () => {
    const answer = {
      isCorrect: store.userAnswer.join() === correctAnswer.join(),
      chain: store.userAnswer.toString(),
    };
    await mocaStore.sendAnswer({
      questionNumber: store.level,
      answer: JSON.stringify(answer),
      context: store.valueArray.toString(),
    });
  };

  const completeTask = (delay?: number) => {
    if (store.finish) return;
    store.setFinish();
    sendData();
    nextTask(delay);
  };

  useEffect(() => {
    if (store.userAnswer.length === store.valueArray.length) {
      completeTask();
    }
  }, [store.userAnswer.length]);

  const isClicked = (value: string) => store.userAnswer.some((existValue) => existValue === value);

  const handleClick = (value: string) => {
    if (!isClicked(value)) {
      store.pushLetter(value);
    }
  };

  return (
    <MocaPageWrapper
      level={store.questionNumber}
      header={t('moca:title.1')}
      timeLeft={store.timer.timeLeft}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => {
        store.timer.pause();
        completeTask(0);
      }}
    >
      <Stack direction='row' spacing='1rem' height='100%'>
        <TaskContext flex='1 1 25%' spacing='1rem'>
          <Lottie animationData={animationData} />
          <Typography
            fontWeight='500'
            fontSize='1rem'
            textTransform='uppercase'
            sx={{ '[data-bold]': { fontWeight: '700' } }}
          >
            Соедините <strong>1</strong> с <strong>А</strong>,
            <br />а затем <strong>А</strong> с <strong>2</strong> и т.д.
            <br />
            <br />
            Закончите на <strong>Д</strong>.
          </Typography>
        </TaskContext>
        <TaskContext
          position='relative'
          flex='0 1 75%'
          sx={{
            svg: { maxHeight: '90%', maxWidth: '90%', position: 'absolute' },
            borderColor: isAudioPlaying ? null : 'primary.main',
          }}
        >
          <svg viewBox='0 0 680 545' fill='none' xmlns='http://www.w3.org/2000/svg'>
            {store.lines.map(({ firstCircle, secondCircle }, index) => (
              <Line
                key={index}
                x1={firstCircle.x}
                y1={firstCircle.y}
                x2={secondCircle.x}
                y2={secondCircle.y}
              />
            ))}
            {store.circles.map((circle, i) => (
              <CircleSVG
                key={i}
                coords={circle}
                value={store.valueArray[i]}
                handleClick={() => handleClick(store.valueArray[i])}
                isSelected={isClicked(store.valueArray[i])}
              />
            ))}
          </svg>
        </TaskContext>
      </Stack>
    </MocaPageWrapper>
  );
});
