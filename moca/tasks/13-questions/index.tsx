import { Grid, Typography } from '@mui/material';
import { TaskContext } from 'features/moca/controls/task-context';
import { useMocaStore } from 'features/moca/store/provider';
import MocaPageWrapper from 'features/moca/wrapper';
import { useStaticAudio } from 'hooks/useAudio';
import useMediaRecorder from 'hooks/useMediaRecorder';
import { useNextTask } from 'hooks/useNextTask';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStoreWithSpeech } from 'stores/hooks/useLocalStoreWithSpeech';
import { Orientation } from './store';
import { questions } from './store/static';

const PAUSE_TIME = 2000;

export const Questions = observer(() => {
  const mocaStore = useMocaStore();
  const store = useStoreWithSpeech(Orientation);
  const { t } = useTranslation();
  const { playAudio, isAudioPlaying } = useStaticAudio({ startPlayFlag: true });
  const nextTask = useNextTask();

  const { startRecord, stopRecord } = useMediaRecorder();

  const sendData = async () => {
    const result = await stopRecord();
    await mocaStore.sendAnswer({
      questionNumber: store.questionNumber,
      context: new Date().toISOString(),
      file: result ?? undefined,
      answer: store.userAnswer.flat().join(';'),
    });
  };

  useEffect(() => {
    if (store.finish) {
      sendData();
      nextTask();
    }
  }, [store.finish]);

  const playContextAudio = () =>
    playAudio(store.audioName).finally(() => {
      store.speech.start();
      store.speech.setSilence(false);
      store.timer.start();
      startRecord();
    });

  useEffect(() => {
    if (store.currentQuestion >= 0) {
      store.timer.reset();
      playContextAudio();
    }
  }, [store.currentQuestion]);

  useEffect(() => {
    let id: NodeJS.Timeout;

    store.setAnswer();

    if (store.speech.alternative?.text) {
      id = setTimeout(() => {
        store.nextQuestion();
        store.speech.setSilence(true);
      }, PAUSE_TIME);
    }
    return () => clearTimeout(id);
  }, [store.speech.alternative?.text]);

  useEffect(() => {
    playAudio(`MMSE01D_0`).finally(playContextAudio);
  }, []);

  return (
    <MocaPageWrapper
      serverError={store.speech.serverError}
      header={t('moca:title.13')}
      timeLeft={store.timer.timeLeft}
      level={store.questionNumber}
      continueBtnDisabled={isAudioPlaying}
      onNext={() => store.nextQuestion(0)}
    >
      <Grid
        container
        spacing='2rem'
        width='70vw'
        maxWidth='60rem'
        minWidth='37rem'
        alignSelf='center'
      >
        {questions[store.currentStage]?.map((question, i) => (
          <React.Fragment key={i}>
            <Grid item xs={7}>
              <TaskContext border='none' alignItems='left' height='100%'>
                <Typography fontWeight='500' textAlign='left' fontSize='1.2rem'>
                  {question}
                </Typography>
              </TaskContext>
            </Grid>
            <Grid item xs={5}>
              <TaskContext
                px='0.5rem'
                height='100%'
                sx={{
                  borderColor:
                    (isAudioPlaying && store.stageUserAnswer[i] === undefined) ||
                    (i !== store.currentQuestion && store.stageUserAnswer[i] === undefined)
                      ? 'transparent'
                      : store.stageUserAnswer[i] !== undefined && i !== store.currentQuestion
                      ? '#E0E0E0'
                      : 'primary.main',
                  borderStyle:
                    store.speech.status === 'start' && i === store.currentQuestion
                      ? 'dashed'
                      : null,
                }}
              >
                <Typography fontSize='1.2rem' fontWeight='500' textAlign='center'>
                  {(() => {
                    if (store.stageUserAnswer[i] === undefined) return '\u00A0';

                    const answerList = store.stageUserAnswer[i]?.split(' ');
                    return (
                      ((answerList?.length ?? 0) > 5 ? '... ' : '') +
                        answerList?.slice(-5).join(' ') || '\u00A0'
                    );
                  })()}
                </Typography>
              </TaskContext>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </MocaPageWrapper>
  );
});
