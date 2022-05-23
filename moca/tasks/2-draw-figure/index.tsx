import { Stack } from '@mui/material';
import PaintCanvas from 'components/paint-canvas';
import { removeCanvasShapeHandlerFactory } from 'components/paint-canvas/clearHandlerFactory';
import { TaskContext } from 'features/moca/controls/task-context';
import { useNextTaskDelay } from 'features/moca/hooks/useNextTaskDelay';
import { useMocaStore } from 'features/moca/store/provider';

import MocaPageWrapper from 'features/moca/wrapper';
import { useMocaStaticAudio } from 'features/moca/hooks/useMocaStaticAudio';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'script/app/stores/hooks/useLocalStore';
import { Figure } from './store';

export const DrawFigure = observer(() => {
  const mocaStore = useMocaStore();
  const store = useStore(Figure);
  const { t } = useTranslation();

  const ref = useRef<HTMLCanvasElement | null>(null);

  const nextTask = useNextTaskDelay(0);

  const { playAudio, isAudioPlaying } = useMocaStaticAudio({ startPlayFlag: true });

  useEffect(() => {
    playAudio('M02D_0').finally(() => {
      store.timer.start();
    });
  }, []);

  useEffect(() => {
    const clearCanvasHandler = removeCanvasShapeHandlerFactory(ref.current, store.coords, true);
    window.addEventListener('keypress', clearCanvasHandler);
    return () => window.removeEventListener('keypress', clearCanvasHandler);
  }, [ref]);

  const sendData = () => {
    store.timer.pause();
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

  return (
    <MocaPageWrapper
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      header={t('moca:title.2')}
      onNext={() => {
        sendData();
        nextTask();
      }}
      continueBtnDisabled={isAudioPlaying}
    >
      <Stack alignItems='center'>
        <Stack direction='row' spacing='1rem' maxWidth='60rem' alignItems='stretch'>
          <TaskContext flex='1 1 100%'>
            <img src={store.data?.fileLink} width='80%' draggable='false' />
          </TaskContext>
          <TaskContext
            p='0'
            sx={{ borderColor: isAudioPlaying ? null : 'primary.main' }}
            zIndex='1'
          >
            <PaintCanvas
              toolsOffset='3px'
              ref={ref}
              lineWeight={8}
              eraser
              backArrow
              onBackArrowClick={removeCanvasShapeHandlerFactory(ref.current, store.coords)}
              disableControls={store.coords.shapesCount === 0}
              onMouseMove={store.coords.mouseMoveHandler}
              onMouseDown={store.coords.mouseDownHandler}
              onClear={store.coords.clearCoordinates}
            />
          </TaskContext>
        </Stack>
      </Stack>
    </MocaPageWrapper>
  );
});
