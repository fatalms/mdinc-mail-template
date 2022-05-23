import { makeAutoObservable } from 'mobx';
import { Timer } from 'stores/core/timer';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';

const fillRequiredArray = (quantity: number) => {
  const array: string[] = [];
  for (let i = 0; i < quantity; i++) {
    let randomNum: string;
    do {
      randomNum = Math.floor(Math.random() * 10).toString();
    } while (array.some((num) => num === randomNum));
    array.push(randomNum);
  }
  return array;
};

export type TaskInfoType = {
  correctAnswer: string[];
  userAnswer: string[];
  questionNumber: number;
};

const numbers: { [key: string]: string[] } = {
  0: ['ноль'],
  1: ['один'],
  2: ['два'],
  3: ['три'],
  4: ['четыре'],
  5: ['пять'],
  6: ['шесть'],
  7: ['семь'],
  8: ['восемь'],
  9: ['девять'],
};

export class SayNumbers implements TaskInfoType {
  finish = false;

  speech = new YandexSpeechRecognition_v3();
  timer = new Timer({ initSeconds: 90 });

  readonly correctAnswer: string[];

  quantity: number;

  constructor(quantity: number) {
    this.quantity = quantity;
    this.correctAnswer = fillRequiredArray(quantity);
    makeAutoObservable(this, {}, { autoBind: true });
  }
  readonly questionNumber = 6;

  get isFullAnswer() {
    return this.userAnswer.every((item) => item !== '');
  }

  get words() {
    return this.speech.words
      ?.map((word) => {
        for (const key in numbers) {
          const values = numbers[key] as string[];
          if (values.includes(word.text)) return key;
        }
        return null;
      })
      .filter((item) => item !== null);
  }

  get userAnswer() {
    const answer = this.words?.slice(0, this.quantity) || [];
    return [...answer, ...Array(this.quantity - answer.length).fill('')];
  }

  setFinish = () => {
    this.finish = true;
  };
}
