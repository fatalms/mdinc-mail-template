import { flow, makeAutoObservable } from 'mobx';
import { getMocaQuestion } from 'features/moca/store/api.service';
import { CanvasCoordinates } from 'stores/core/coordinates';
import { Timer } from 'stores/core/timer';

type FigureResponse = StoreDefinitions.RequestState<Components.Schemas.IQuestionFigure>;

export class Figure implements FigureResponse {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchTask();
  }
  readonly questionNumber = 2;

  timer = new Timer({ initSeconds: 90 });

  coords = new CanvasCoordinates();

  data: Components.Schemas.IQuestionFigure | null = null;
  apiStatus: StoreDefinitions.ApiStatus = 'None';

  fetchTask = flow(function* (this: Figure) {
    this.apiStatus = 'Pending';
    try {
      this.data = yield getMocaQuestion(this.questionNumber);
      this.apiStatus = 'Success';
    } catch (error) {
      this.apiStatus = 'Failed';
    }
  });
}
