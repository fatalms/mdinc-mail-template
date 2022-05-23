import { api } from 'api/api-client';
import { MocaAnswerData } from '.';
import { config } from 'src/config';

export const getMocaQuestion = (num: number, mocaId?: number) => {
  if (mocaId !== undefined) {
    return api.doGet<Components.Schemas.IQuestionMemory>(`/api/moca-question/${num}/${mocaId}`);
  }
  return api.doGet<Components.Schemas.IQuestionMemory>(`/api/moca-question/${num}`);
};

export const sendMocaAnswer = async (data: MocaAnswerData) => {
  const url = config.apiHost + '/api/moca-answer';
  const formData = new FormData();
  formData.append('questionNumber', String(data.questionNumber));
  formData.append('mocaId', String(data.mocaId));
  data.file && formData.append('file', data.file);
  typeof data.context !== 'undefined' && formData.append('context', String(data.context));
  formData.append('answer', String(data.answer) || ' ');
  data.timer && formData.append('answer', data.timer.join(','));
  typeof data.questionUUID !== 'undefined' &&
    formData.append('questionUUID', String(data.questionUUID));
  return await api.doPost<Components.Schemas.IMocaAnswer>(url, formData);
};

export const getMocaTime = async () => {
  return await api.doGet<Components.Schemas.IMocaQuestionTime[]>('/api/moca-question-time');
};

export const getAllMoca = () => {
  return api.doGet<Components.Schemas.IMoca[]>('/api/moca');
};

export const postMoca = () => {
  return api.doPost<Components.Schemas.IMoca>('/api/moca', {
    date: new Date().toISOString(),
  });
};
