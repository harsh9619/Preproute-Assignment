import { takeEvery, put, call } from 'redux-saga/effects';
import { api } from '../../services';
import * as actionTypes from './actionTypes';
import {
  fetchTestsSuccess,
  fetchTestsFailure,
  fetchTestSuccess,
  fetchTestFailure,
  createTestSuccess,
  createTestFailure,
  updateTestSuccess,
  updateTestFailure,
  deleteTestSuccess,
  deleteTestFailure,
  fetchSubjectsSuccess,
  fetchSubjectsFailure,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  fetchSubTopicsSuccess,
  fetchSubTopicsFailure
} from './actions';

function* handleFetchTests(): Generator<any, void, any> {
  try {
    const response = yield call(api.getTests);
    if (response.status) {
      yield put(fetchTestsSuccess(response.data));
    } else {
      yield put(fetchTestsFailure(response.message || 'Failed to fetch tests'));
    }
  } catch (err: any) {
    yield put(fetchTestsFailure(err.message || 'Error fetching tests'));
  }
}

function* handleFetchTest(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getTest, action.payload);
    if (response.status) {
      yield put(fetchTestSuccess(response.data));
    } else {
      yield put(fetchTestFailure(response.message || 'Failed to fetch test details'));
    }
  } catch (err: any) {
    yield put(fetchTestFailure(err.message || 'Error fetching test details'));
  }
}

function* handleCreateTest(action: any): Generator<any, void, any> {
  const { testData, resolve, reject } = action.payload;
  try {
    const response = yield call(api.createTest, testData);
    if (response.status) {
      yield put(createTestSuccess(response.data));
      resolve(response);
    } else {
      yield put(createTestFailure(response.message || 'Failed to create test'));
      reject(new Error(response.message || 'Failed to create test'));
    }
  } catch (err: any) {
    yield put(createTestFailure(err.message || 'Error creating test'));
    reject(err);
  }
}

function* handleUpdateTest(action: any): Generator<any, void, any> {
  const { id, testData, resolve, reject } = action.payload;
  try {
    const response = yield call(api.updateTest, id, testData);
    if (response.status) {
      yield put(updateTestSuccess(response.data));
      resolve(response);
    } else {
      yield put(updateTestFailure(response.message || 'Failed to update test'));
      reject(new Error(response.message || 'Failed to update test'));
    }
  } catch (err: any) {
    yield put(updateTestFailure(err.message || 'Error updating test'));
    reject(err);
  }
}

function* handleDeleteTest(action: any): Generator<any, void, any> {
  const { id, resolve, reject } = action.payload;
  try {
    const response = yield call(api.deleteTest, id);
    if (response.status) {
      yield put(deleteTestSuccess(id));
      resolve(response);
    } else {
      yield put(deleteTestFailure(response.message || 'Failed to delete test'));
      reject(new Error(response.message || 'Failed to delete test'));
    }
  } catch (err: any) {
    yield put(deleteTestFailure(err.message || 'Error deleting test'));
    reject(err);
  }
}

function* handleFetchSubjects(): Generator<any, void, any> {
  try {
    const response = yield call(api.getSubjects);
    if (response.status) {
      yield put(fetchSubjectsSuccess(response.data));
    } else {
      yield put(fetchSubjectsFailure(response.message || 'Failed to fetch subjects'));
    }
  } catch (err: any) {
    yield put(fetchSubjectsFailure(err.message || 'Error fetching subjects'));
  }
}

function* handleFetchTopics(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getTopics, action.payload);
    if (response.status) {
      yield put(fetchTopicsSuccess(response.data));
    } else {
      yield put(fetchTopicsFailure(response.message || 'Failed to fetch topics'));
    }
  } catch (err: any) {
    yield put(fetchTopicsFailure(err.message || 'Error fetching topics'));
  }
}

function* handleFetchSubTopics(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getSubTopicsMulti, action.payload);
    if (response.status) {
      yield put(fetchSubTopicsSuccess(response.data));
    } else {
      yield put(fetchSubTopicsFailure(response.message || 'Failed to fetch sub-topics'));
    }
  } catch (err: any) {
    yield put(fetchSubTopicsFailure(err.message || 'Error fetching sub-topics'));
  }
}

export function* watchTests(): Generator<any, void, any> {
  yield takeEvery(actionTypes.FETCH_TESTS_REQUEST, handleFetchTests);
  yield takeEvery(actionTypes.FETCH_TEST_REQUEST, handleFetchTest);
  yield takeEvery(actionTypes.CREATE_TEST_REQUEST, handleCreateTest);
  yield takeEvery(actionTypes.UPDATE_TEST_REQUEST, handleUpdateTest);
  yield takeEvery(actionTypes.DELETE_TEST_REQUEST, handleDeleteTest);
  yield takeEvery(actionTypes.FETCH_SUBJECTS_REQUEST, handleFetchSubjects);
  yield takeEvery(actionTypes.FETCH_TOPICS_REQUEST, handleFetchTopics);
  yield takeEvery(actionTypes.FETCH_SUBTOPICS_REQUEST, handleFetchSubTopics);
}
