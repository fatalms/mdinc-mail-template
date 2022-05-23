import { getMocaQuestion } from 'features/moca/store/api.service';
import { action, flow, makeAutoObservable } from 'mobx';
import { Timer } from 'stores/core/timer';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';
import { Speechable } from 'stores/hooks/useLocalStoreWithSpeech';

export class Animal implements Speechable {
  speech = new YandexSpeechRecognition_v3();
  timer = new Timer({ initSeconds: 90 });

  readonly questionNumber = 4;

  currentCard = 0;

  data: Components.Schemas.IQuestionAnimal[] | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';

  private nextCardTimeout?: NodeJS.Timeout = undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchTask();
  }

  get lastWord() {
    return this.speech.words?.[this.speech.words.length - 1].text.toLowerCase();
  }

  get finish() {
    return this.timer.finished || this.currentCard > 2;
  }

  get isCorrectLastWord() {
    return this.data?.[this.currentCard]?.correctAnswer
      .split(' ')
      .some((word) => word.toLocaleLowerCase() === this.lastWord);
  }

  get isWaitNextCard() {
    return !!this.nextCardTimeout;
  }

  waitNextCard = () => {
    if (this.nextCardTimeout) return;
    this.nextCardTimeout = setTimeout(
      action(() => {
        this.speech.reset();
        this.nextCard();
        this.nextCardTimeout = undefined;
      }),
      1000
    );
  };

  nextCard = () => {
    if (this.currentCard < 3) {
      this.currentCard++;
    }
  };

  fetchTask = flow(function* (this: Animal) {
    this.apiStatus = 'Pending';
    try {
      this.data = yield getMocaQuestion(4);
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
