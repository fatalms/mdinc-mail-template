import { flow, makeAutoObservable } from 'mobx';
import * as mocaApi from './api.service';

export type MocaAnswerData = Omit<Components.Schemas.ICreateMocaAnswerDto, 'file'> & {
  file?: Blob | null;
};
export class MocaStore {
  constructor() {
    makeAutoObservable(this);
  }

  testId = -1;

  allTestsStatus: StoreDefinitions.ApiStatus = 'None';
  answerStatus: StoreDefinitions.ApiStatus = 'None';
  postNewStatus: StoreDefinitions.ApiStatus = 'None';
  timingsStatus: StoreDefinitions.ApiStatus = 'None';

  allTests?: Components.Schemas.IMoca[] | null;
  answer?: MocaAnswerData | null;
  newTest?: Components.Schemas.IMoca | null;
  timings: Components.Schemas.IMocaQuestionTime[] = [];

  init = flow(function* (this: MocaStore) {
    yield this.fetchAllTests();
    if (!this.allTests) return;
    const lastMoca = this.allTests[this.allTests.length - 1];
    if (lastMoca.isFinished) {
      yield this.fetchNewTest();
    } else {
      this.newTest = lastMoca;
      this.testId = lastMoca.id;
    }
  });

  fetchTimings = flow(function* (this: MocaStore) {
    this.timingsStatus = 'Pending';
    try {
      this.timings = yield mocaApi.getMocaTime().then((data) => {
        return data?.map((item) => ({ ...item, time: item.time * 60 }));
      });
      this.timingsStatus = 'Success';
    } catch (error) {
      this.timingsStatus = 'Failed';
      console.error(error);
    }
  });

  fetchAllTests = flow(function* (this: MocaStore) {
    this.allTestsStatus = 'Pending';
    try {
      this.allTests = yield mocaApi.getAllMoca();
      this.allTestsStatus = 'Success';
    } catch (error) {
      this.allTestsStatus = 'Failed';
      console.error(error);
    }
  });

  sendAnswer = flow(function* (this: MocaStore, props: Omit<MocaAnswerData, 'mocaId'>) {
    this.answerStatus = 'Pending';
    try {
      console.table(props);
      this.answer = yield mocaApi.sendMocaAnswer({
        ...props,
        mocaId: this.testId,
      });
      this.answerStatus = 'Success';
    } catch (error) {
      this.answerStatus = 'Failed';
      console.error(error);
    }
  });

  fetchNewTest = flow(function* (this: MocaStore) {
    this.postNewStatus = 'Pending';
    try {
      this.newTest = yield mocaApi.postMoca();
      this.testId = this.newTest?.id || -1;
      this.postNewStatus = 'Success';
    } catch (error) {
      this.postNewStatus = 'Failed';
      console.error(error);
    }
  });
}
