import { flow, makeAutoObservable } from 'mobx';
import { getMocaQuestion } from 'features/moca/store/api.service';
import { CanvasCoordinates } from 'stores/core/coordinates';
import { Timer } from 'stores/core/timer';

type ClockState = StoreDefinitions.RequestState<Components.Schemas.IQuestionClock>;

export class Clock implements ClockState {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchTask();
  }
  readonly questionNumber = 3;

  coords = new CanvasCoordinates();

  timer = new Timer({ initSeconds: 90 });

  data: Components.Schemas.IQuestionClock | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';

  fetchTask = flow(function* (this: Clock) {
    this.apiStatus = 'Pending';
    try {
      this.data = yield getMocaQuestion(this.questionNumber);
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
