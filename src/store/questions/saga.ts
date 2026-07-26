import { takeEvery, put, call } from 'redux-saga/effects';
import { api } from '../../services';
import * as actionTypes from './actionTypes';
import {
  createQuestionsSuccess,
  createQuestionsFailure,
  fetchQuestionsBulkSuccess,
  fetchQuestionsBulkFailure
} from './actions';

function* handleCreateQuestions(action: any): Generator<any, void, any> {
  const { questions, resolve, reject } = action.payload;
  try {
    const response = yield call(api.createQuestions, questions);
    if (response.status) {
      yield put(createQuestionsSuccess(response.data));
      resolve(response);
    } else {
      yield put(createQuestionsFailure(response.message || 'Failed to create questions'));
      reject(new Error(response.message || 'Failed to create questions'));
    }
  } catch (err: any) {
    yield put(createQuestionsFailure(err.message || 'Error creating questions'));
    reject(err);
  }
}

// Watcher and handler for fetching questions bulk
function* handleFetchQuestionsBulk(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.fetchQuestionsBulk, action.payload);
    if (response.status) {
      yield put(fetchQuestionsBulkSuccess(response.data));
    } else {
      yield put(fetchQuestionsBulkFailure(response.message || 'Failed to fetch bulk questions'));
    }
  } catch (err: any) {
    yield put(fetchQuestionsBulkFailure(err.message || 'Error fetching bulk questions'));
  }
}

export function* watchQuestions(): Generator<any, void, any> {
  yield takeEvery(actionTypes.CREATE_QUESTIONS_REQUEST, handleCreateQuestions);
  yield takeEvery(actionTypes.FETCH_QUESTIONS_BULK_REQUEST, handleFetchQuestionsBulk);
}
