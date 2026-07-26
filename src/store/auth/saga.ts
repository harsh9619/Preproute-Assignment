import { takeEvery, put, call } from 'redux-saga/effects';
import { api } from '../../services';
import * as actionTypes from './actionTypes';
import {
  loginSuccess,
  loginFailure,
  setAuthLoading
} from './actions';

// Auth Saga handlers
function* handleLogin(action: any): Generator<any, void, any> {
  const { userId, password, resolve } = action.payload;
  yield put(setAuthLoading(true));
  try {
    const response = yield call(api.login, userId, password);
    if (response.status && response.data) {
      const { token, user } = response.data;

      localStorage.setItem('preproute_token', token);
      localStorage.setItem('preproute_user', JSON.stringify(user));

      yield put(loginSuccess({ user, token }));
      resolve({ success: true });
    } else {
      yield put(loginFailure('Authentication failed'));
      resolve({ success: false, message: 'Authentication failed' });
    }
  } catch (error: any) {
    const errMsg = error.message || 'Server error during login';
    yield put(loginFailure(errMsg));
    resolve({ success: false, message: errMsg });
  } finally {
    yield put(setAuthLoading(false));
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    localStorage.removeItem('preproute_token');
    localStorage.removeItem('preproute_user');
  } catch (e) {
    console.error('Logout local storage cleanup error:', e);
  }
}

// Watchers
export function* watchAuth(): Generator<any, void, any> {
  yield takeEvery(actionTypes.LOGIN_REQUEST, handleLogin);
  yield takeEvery(actionTypes.LOGOUT, handleLogout);
}
