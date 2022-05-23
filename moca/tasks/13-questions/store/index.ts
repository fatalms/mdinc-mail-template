import { makeAutoObservable, action } from 'mobx';
import { Timer } from 'stores/core/timer';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';
import { Speechable } from 'stores/hooks/useLocalStoreWithSpeech';
import { audioList, questions } from './static';

export class Orientation implements Speechable {
  speech = new YandexSpeechRecognition_v3();

  timer = new Timer({
    initSeconds: 60,
    onEnd: () => {
      this.nextQuestion(0);
    },
  });

  readonly questionNumber = 13;
  readonly maxQuestions = 6;

  currentQuestion = 0;
  currentStage = 0;

  readonly percent = Math.floor(Math.random() * 70 + 30);

  finish = false;

  userAnswer: string[][] = questions.map((item) => item.map(() => ''));

  get stageUserAnswer() {
    return this.userAnswer[this.currentStage];
  }

  constructor() {
    makeAutoObservable(this);
  }

  get audioName() {
    return (
      audioList[this.currentStage] &&
      `MMSE01C_${audioList[this.currentStage][this.currentQuestion]}`
    );
  }

  get stageLength() {
    return questions[this.currentStage]?.length;
  }

  setAnswer() {
    if (!this.speech.alternative?.text) return;
    this.userAnswer[this.currentStage][this.currentQuestion] =
      this.speech.alternative.text.toLowerCase();
  }

  private tID?: NodeJS.Timeout = undefined;

  nextQuestion(delay = 500) {
    if (this.tID || this.finish) return;

    this.tID = setTimeout(
      action('nextQuestion', () => {
        this.tID = undefined;
        this.speech.reset();

        if (this.stageLength <= ++this.currentQuestion) {
          if (questions[++this.currentStage] === undefined) {
            this.finish = true;
          }
          this.currentQuestion = 0;
        }
      }),
      delay
    );
  }
}
