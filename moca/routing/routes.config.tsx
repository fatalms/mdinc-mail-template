import React, { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PAGE_404_PATH } from 'script/app/routing/routes.config';
import { MocaStoreProvider } from '../store/provider';
import { MocaBrokenLine } from '../tasks/1-broken-line';
import { TestVoiceLetter } from '../tasks/10-voice-letter';
import { MocaAbstraction } from '../tasks/11-abstraction';
import { Questions } from '../tasks/13-questions';
import { DrawFigure } from '../tasks/2-draw-figure';
import { DrawClock } from '../tasks/3-draw-clock';
import { MocaAnimals } from '../tasks/4-animals';
import { RepeatWords } from '../tasks/5-repeat-words';
import { SayNumbers } from '../tasks/6-say-numbers';
import { Clap } from '../tasks/7-clap';
import { MocaSubtraction } from '../tasks/8-subtraction';
import { MocaVoiceSentence } from '../tasks/9-sentence';

const mocaRoutes = [
  MocaBrokenLine,
  DrawFigure,
  DrawClock,
  MocaAnimals,
  (props: { questionNumber: number }) => <RepeatWords variant='first' {...props} />,
  SayNumbers,
  Clap,
  MocaSubtraction,
  MocaVoiceSentence,
  TestVoiceLetter,
  MocaAbstraction,
  (props: { questionNumber: number }) => <RepeatWords variant='second' {...props} />,
  Questions,
];

export const routesLength = mocaRoutes.length;

export default function MocaComponents() {
  const { taskId } = useParams();
  const Component = useMemo(() => mocaRoutes[Number(taskId) - 1], [taskId]);

  return (
    <MocaStoreProvider>
      {taskId && Component ? (
        <Component questionNumber={+taskId} />
      ) : (
        <Navigate to={PAGE_404_PATH} replace />
      )}
    </MocaStoreProvider>
  );
}
