import * as actionTypes from './actionTypes';
import { AuthState } from '../types';

// Auth Reducer
const getInitialAuthState = (): AuthState => {
  try {
    const token = localStorage.getItem('preproute_token');
    const userJson = localStorage.getItem('preproute_user');
    return {
      user: userJson ? JSON.parse(userJson) : null,
      token: token || null,
      loading: false,
      error: null
    };
  } catch (e) {
    return {
      user: null,
      token: null,
      loading: false,
      error: null
    };
  }
};

export const authReducer = (state = getInitialAuthState(), action: any): AuthState => {
  switch (action.type) {
    case actionTypes.SET_AUTH_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};
export default authReducer;
