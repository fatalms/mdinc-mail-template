import { getMocaQuestion } from 'features/moca/store/api.service';
import { flow, makeAutoObservable } from 'mobx';
import { Timer } from 'stores/core/timer';
import { YandexSpeechRecognition_v3 } from 'stores/core/yandexSpeech_v3';
import { Speechable } from 'stores/hooks/useLocalStoreWithSpeech';

type MemoryResponse = StoreDefinitions.RequestState<Components.Schemas.IQuestionMemory>;

type Words = { word: string; isGuessed: boolean };

export class Memory implements Speechable {
  readonly questionNumber;

  speech = new YandexSpeechRecognition_v3();
  timer = new Timer({ initSeconds: 90 });

  data: Components.Schemas.IQuestionMemory | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';
  words?: Words[];

  constructor(questionNumber: number) {
    this.questionNumber = questionNumber;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get allGuessed() {
    const speechWords = this.speech.words?.map((word) => word.text);
    return this.data?.words.every((word) => speechWords?.includes(word));
  }


  get finish() {
    return this.timer.finished || this.allGuessed;
  }

  fetchTask = flow(function* (this: Memory, mocaId?: number) {
    this.apiStatus = 'Pending';
    try {
      const response: MemoryResponse['data'] = yield getMocaQuestion(this.questionNumber, mocaId);
      this.data = response;
      this.words = response?.words.map((word) => ({ word, isGuessed: false }));
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
