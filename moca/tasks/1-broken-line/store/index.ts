import { makeAutoObservable } from 'mobx';
import { Timer } from 'stores/core/timer';
import { allowedCoords, correctAnswer, getRandomArr } from './static';
import { LinesState } from './types';

export class BrokenLine implements LinesState {
  constructor() {
    makeAutoObservable(this);
  }

  finish = false;

  timer = new Timer({
    initSeconds: 90,
    onEnd: () => {
      this.finish = true;
    },
  });

  readonly questionNumber = 1;
  readonly levelLength = correctAnswer.length;
  readonly lines: LinesState['lines'] = [];
  readonly circles = allowedCoords[0];
  readonly valueArray = getRandomArr();
  userAnswer: string[] = [];
  level = 1;

  setFinish = () => {
    this.finish = true;
  };

  pushLetter = (payload: string) => {
    const indexOfLastClickedValue = this.valueArray.indexOf(
      this.userAnswer[this.userAnswer.length - 1]
    );
    if (this.userAnswer.length > 0) {
      this.lines.push({
        firstCircle: this.circles[indexOfLastClickedValue],
        secondCircle: this.circles[this.valueArray.indexOf(payload)],
      });
    }
    this.userAnswer.push(payload);
  };
}
