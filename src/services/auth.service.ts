import axiosInstance from './axios';

export const authService = {
  login: (userId: any, password: any): Promise<any> => {
    return axiosInstance.post('auth/login', { userId, password });
  },
};
