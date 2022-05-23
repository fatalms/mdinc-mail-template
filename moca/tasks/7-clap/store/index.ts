import { flow, makeAutoObservable } from 'mobx';
import { getMocaQuestion } from 'features/moca/store/api.service';
import { Timer } from 'stores/core/timer';

type ReactionRequest = StoreDefinitions.RequestState<Components.Schemas.IQuestionReaction>;

export interface ReactionProps {
  questionNumber: number;
  clickCount: number;
  startTime: number;
  statuses: boolean[];
  timings: number[];
  isListing: boolean;
}

const START_DELAY = 500;
const SPACE_CLICK_TIME = 700;

export class Reaction implements ReactionRequest, ReactionProps {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchTask();
  }
  readonly questionNumber = 7;

  timer = new Timer({ initSeconds: 60 });

  data: Components.Schemas.IQuestionReaction | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';
  error?: string | null | undefined;
  isListing = false;
  startTime = NaN;
  statuses = Array<boolean>(10).fill(false);
  timings: number[] = [];
  currentSpace = 0;

  clickCount = 0;

  finish = false;

  setCurrentSpace = (space: number) => {
    this.currentSpace = space;
  };

  applyTiming = () => {
    const timePassed = new Date().getTime() - this.startTime - START_DELAY;

    const index = this.data?.targetTimestamps?.findIndex(
      (time) =>
        timePassed < +time + SPACE_CLICK_TIME * 2 && timePassed > +time - SPACE_CLICK_TIME / 2
    );
    if (index !== undefined && this.statuses[index] === false) {
      this.statuses[index] = true;
    }
    this.timings.push(timePassed);
  };

  setFinish = () => {
    this.finish = true;
  };

  updateCurrentWordTime() {
    this.startTime = new Date().getTime();
  }

  setListening(payload: boolean) {
    this.isListing = payload;
  }

  fetchTask = flow(function* (this: Reaction) {
    this.apiStatus = 'Pending';
    try {
      this.data = yield getMocaQuestion(this.questionNumber);
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
