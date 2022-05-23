import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { Box, List, ListItem, Stack, Typography, TypographyProps } from '@mui/material';
import PaintCanvas from 'components/paint-canvas';
import { removeCanvasShapeHandlerFactory } from 'components/paint-canvas/clearHandlerFactory';
import { TaskContext } from 'features/moca/controls/task-context';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import MocaPageWrapper from 'features/moca/wrapper';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { useStore } from 'script/app/stores/hooks/useLocalStore';
import { Clock } from './store';

const clockRequires = ['контур', 'циферблат', 'стрелки (часовая, минутная)'];
const clockTimeVariant = ['11:10', '4:05', '9:10'];

const UpperCaseTypography = (props: TypographyProps) => (
  <Typography variant='subtitle1' fontWeight='500' textTransform='uppercase' {...props} />
);

export const DrawClock = observer(() => {
  const mocaStore = useMocaStore();
  const store = useStore(Clock);

  const ref = useRef<HTMLCanvasElement | null>(null);

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  const nextTask = useNextTaskDelay(0);

  useEffect(() => {
    if (store.data?.time) {
      const time = store.data?.time;
      playAudio(`M03DC_${String(clockTimeVariant.findIndex((item) => item === time))}`).finally(
        () => {
          store.timer.start();
        }
      );
    }
  }, [store.data?.description]);

  useEffect(() => {
    const clearCanvasHandler = removeCanvasShapeHandlerFactory(ref.current, store.coords, true);
    window.addEventListener('keypress', clearCanvasHandler);
    return () => window.removeEventListener('keypress', clearCanvasHandler);
  }, [ref]);

  const sendData = () => {
    ref?.current?.toBlob((blob) => {
      mocaStore.sendAnswer({
        questionNumber: store.questionNumber,

        answer: JSON.stringify(store.coords.fixed2Digits),
        file: blob,
        questionUUID: store.data?.uuid,
        context: store.data?.description,
      });
    });
  };

  useEffect(() => {
    if (store.timer.finished) {
      sendData();
      nextTask();
    }
  }, [store.timer.finished]);

  // store.data?.description
  return (
    <MocaPageWrapper
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={`Нарисуйте часы, показывающие ${store.data?.description}`}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => {
        sendData();
        nextTask();
      }}
    >
      <Stack direction='row' spacing='3rem' justifyContent='center'>
        <Stack spacing='2rem' justifyContent='center'>
          <Box>
            <UpperCaseTypography>заданное время</UpperCaseTypography>
            <TaskContext border='none' px='1rem'>
              <UpperCaseTypography color='primary.main'>
                {store.data?.description}
              </UpperCaseTypography>
            </TaskContext>
          </Box>
          <Box>
            <UpperCaseTypography>обязательные элементы</UpperCaseTypography>
            <TaskContext border='none' px='1rem'>
              <List dense={false}>
                {clockRequires.map((value, i) => (
                  <ListItem key={i}>
                    <Stack direction='row' spacing='1rem' alignItems='center'>
                      <DoneRoundedIcon
                        sx={{
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: '#ffffff',
                          width: '0.85rem',
                          height: '0.85rem',
                        }}
                      />
                      <Typography variant='subtitle2' fontWeight='500'>
                        {value}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </TaskContext>
          </Box>
        </Stack>
        <TaskContext
          p='0'
          position='relative'
          sx={{ aspectRatio: '1', borderColor: isAudioPlaying ? null : 'primary.main' }}
        >
          <PaintCanvas
            ref={ref}
            toolsOffset='3px'
            lineWeight={4}
            backArrow
            eraser
            onBackArrowClick={removeCanvasShapeHandlerFactory(ref.current, store.coords)}
            disableControls={store.coords.shapesCount === 0}
            onMouseMove={store.coords.mouseMoveHandler}
            onMouseDown={store.coords.mouseDownHandler}
            onClear={store.coords.clearCoordinates}
          />
        </TaskContext>
      </Stack>
    </MocaPageWrapper>
  );
});
