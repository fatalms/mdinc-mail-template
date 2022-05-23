import { getMocaQuestion } from 'features/moca/store/api.service';
import { flow, makeAutoObservable } from 'mobx';
import { Timer } from 'stores/core/timer';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';
import { Speechable } from 'stores/hooks/useLocalStoreWithSpeech';

type RequestData =
  | (Components.Schemas.IQuestionAssosiation & {
      first: string;
      second: string;
      maxSize: number;
    })
  | null;

export class Association implements Speechable {
  speech = new YandexSpeechRecognition_v3();
  timer = new Timer({ initSeconds: 60 });

  readonly questionNumber = 11;

  private _data: Components.Schemas.IQuestionAssosiation | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchTask();
  }

  get finish() {
    return this.timer.finished || this.isCorrectAnswer;
  }

  get isCorrectAnswer() {
    if (this.data && this.apiStatus === 'Success') {
      const isCorrect = this.data.correctAnswers.some((phrase) =>
        this.speech.alternative?.text.toLocaleLowerCase().includes(phrase.toLocaleLowerCase())
      );
      return isCorrect;
    }
    return false;
  }

  get data(): RequestData {
    if (this._data === null) return this._data;
    const words = this._data.description.split('-') as [string, string];
    return (
      this._data && {
        ...this._data,
        first: words[0],
        second: words[1],
        maxSize: Math.max(...words.map((word) => word.length)),
      }
    );
  }

  fetchTask = flow(function* (this: Association) {
    this.apiStatus = 'Pending';
    try {
      this._data = yield getMocaQuestion(this.questionNumber);
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
