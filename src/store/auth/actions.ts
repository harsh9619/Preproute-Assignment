import * as actionTypes from './actionTypes';
import { User } from '../types';

// Auth Actions
export const loginRequest = (payload: { userId: string; password: string; resolve: (val: any) => void; reject: (err: any) => void }) => ({
  type: actionTypes.LOGIN_REQUEST,
  payload
});

export const loginSuccess = (payload: { user: User; token: string }) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload
});

export const loginFailure = (error: string) => ({
  type: actionTypes.LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: actionTypes.LOGOUT
});

export const setAuthLoading = (loading: boolean) => ({
  type: actionTypes.SET_AUTH_LOADING,
  payload: loading
});
