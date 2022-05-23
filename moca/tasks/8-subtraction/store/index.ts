import { Timer } from 'stores/core/timer';
import { shuffle, cloneDeep } from 'lodash';
import { makeAutoObservable, observable } from 'mobx';
import { TextType } from '../types';
import { allowedValues, TaskText } from './static';

export class Subtraction {
  subtraction: number;
  subtrahend = 7;
  stageCount = 5;
  currentStage = 0;
  variants: number[] = [];
  userAnswer: number[] = [];
  maxVariants = 9;

  readonly header: TextType;
  readonly questionNumber = 8;
  readonly answerNumbers: string[];

  private pushTimeout?: NodeJS.Timeout;

  readonly timer = new Timer({ initSeconds: 90 });

  constructor() {
    const taskVariant = Math.floor(Math.random() * 3);
    this.header = TaskText[taskVariant];
    this.subtraction = this.header.init;
    this.answerNumbers = allowedValues[taskVariant];

    makeAutoObservable(this, { userAnswer: observable.deep }, { autoBind: true });
  }

  private _finish = false;

  get finish() {
    return this.currentStage >= this.stageCount || this.timer.finished || this._finish;
  }

  get currentAnswer() {
    console.log('this.userAnswer:', cloneDeep(this.userAnswer));
    console.log('this.currentStage:', cloneDeep(this.currentStage));
    return this.userAnswer[this.currentStage];
  }

  generateVariants = () => {
    this.variants = shuffle(
      Array(this.maxVariants)
        .fill(null)
        .map((_, x) => this.subtraction - x - 1)
    );
  };

  setFinish = () => {
    this._finish = true;
  };

  pushUsersAnswer = (payload: number) => {
    if (this.pushTimeout) return;
    console.log('payload:', payload);
    this.userAnswer.push(payload);

    this.pushTimeout = setTimeout(() => {
      this.pushTimeout = undefined;
      this.currentStage++;
      this.subtractAnswer();
    }, 1000);
  };

  subtractAnswer = () => {
    this.subtraction -= this.currentAnswer || this.subtrahend;
  };

  nextStep = () => {
    this.currentStage++;
  };
}
