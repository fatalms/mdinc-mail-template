import { getMocaQuestion } from 'features/moca/store/api.service';
import { flow, makeAutoObservable } from 'mobx';
import { Timer } from 'stores/core/timer';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';

type SentenceResponse = StoreDefinitions.RequestState<Components.Schemas.IQuestionSentence[]>;

export type SentenceState = {
  currentCard: number;
};

export class Sentence implements SentenceResponse, SentenceState {
  speech = new YandexSpeechRecognition_v3();
  timer = new Timer({ initSeconds: 60 });

  get finish() {
    return this.timer.finished || this.currentCard > 1;
  }

  readonly questionNumber = 9;

  data: Components.Schemas.IQuestionSentence[] | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';

  currentCard = -1;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchTask();
  }

  get currentLinks() {
    return [this.currentCard === 0 && 'M09D_0', this.data?.[this.currentCard]?.fileLink].filter(
      Boolean
    ) as string[];
  }

  get canPlayAudio() {
    return this.currentCard >= 0 && this.currentCard <= 1;
  }

  get isCorrectAnswer() {
    return (
      this.speech.alternative?.text.toLowerCase().replace(/[.,-_!^;:\s]/g, '') as string
    )?.includes(
      this.data?.[this.currentCard]?.description
        .toLowerCase()
        .replace(/[.,-_!^;:\s]/g, '') as string
    );
  }

  nextCardTimeout?: NodeJS.Timeout = undefined;

  setNextCard = (delay = 750) => {
    if (this.nextCardTimeout) return;

    this.speech.setSilence(true);
    this.nextCardTimeout = setTimeout(() => {
      this.nextCardTimeout = undefined;
      this.speech.reset();
      this.currentCard++;
    }, delay);
  };

  fetchTask = flow(function* (this: Sentence) {
    this.apiStatus = 'Pending';
    try {
      this.data = yield getMocaQuestion(this.questionNumber);
      this.currentCard = 0;
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
