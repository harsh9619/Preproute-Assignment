import axiosInstance from './axios';

export const testsService = {
  getSubjects: (): Promise<any> => {
    return axiosInstance.get('subjects');
  },

  getTopics: (subjectId: any): Promise<any> => {
    return axiosInstance.get(`topics/subject/${subjectId}`);
  },

  getSubTopics: (topicId: any): Promise<any> => {
    return axiosInstance.get(`sub-topics/topic/${topicId}`);
  },

  getSubTopicsMulti: (topicIds: any): Promise<any> => {
    return axiosInstance.post('sub-topics/multi-topics', { topicIds });
  },

  getTests: (): Promise<any> => {
    return axiosInstance.get('tests');
  },

  getTest: (id: any): Promise<any> => {
    return axiosInstance.get(`tests/${id}`);
  },

  createTest: (testData: any): Promise<any> => {
    return axiosInstance.post('tests', testData);
  },

  updateTest: (id: any, testData: any): Promise<any> => {
    return axiosInstance.put(`tests/${id}`, testData);
  },

  deleteTest: (id: any): Promise<any> => {
    return axiosInstance.delete(`tests/${id}`);
  },
};
