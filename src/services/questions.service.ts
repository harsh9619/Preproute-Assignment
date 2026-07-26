import axiosInstance from './axios';

export const questionsService = {
  createQuestions: (questions: any): Promise<any> => {
    return axiosInstance.post('questions/bulk', { questions });
  },

  fetchQuestionsBulk: (questionIds: any): Promise<any> => {
    return axiosInstance.post('questions/fetchBulk', { question_ids: questionIds });
  },
};
