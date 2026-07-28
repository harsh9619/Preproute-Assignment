import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, User } from './types';

// Import module reducers
import authReducer from './auth/reducer';
import testsReducer from './tests/reducer';
import questionsReducer from './questions/reducer';

// Import module sagas
import { watchAuth } from './auth/saga';
import { watchTests } from './tests/saga';
import { watchQuestions } from './questions/saga';

// Import actions for custom hooks
import { loginRequest, logout as logoutAction } from './auth/actions';

import {
  fetchTestsRequest,
  fetchTestRequest,
  createTestRequest,
  updateTestRequest,
  deleteTestRequest,
  fetchSubjectsRequest,
  fetchTopicsRequest,
  fetchSubTopicsRequest
} from './tests/actions';

import {
  createQuestionsRequest,
  fetchQuestionsBulkRequest
} from './questions/actions';


// Re-export actions for convenience
export * from './auth/actions';
export * from './tests/actions';
export * from './questions/actions';

// Root Reducer
const rootReducer = combineReducers({
  auth: authReducer,
  tests: testsReducer,
  questions: questionsReducer,
});

// Root Saga
function* rootSaga(): Generator<any, void, any> {
  yield all([
    watchAuth(),
    watchTests(),
    watchQuestions(),
  ]);
}

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

// Export useAuth hook wrapper over Redux
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = (userId: string, password: string) =>
    new Promise<{ success: boolean; message?: string; user?: User | null }>((resolve, reject) => {
      dispatch(loginRequest({ userId, password, resolve, reject }));
    });

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: !!auth.token,
    loading: auth.loading,
    error: auth.error,
    login,
    logout
  };
};

// Export useTests hook wrapper over Redux
export const useTests = () => {
  const dispatch = useDispatch();
  const testsState = useSelector((state: RootState) => state.tests);

  const fetchTests = () => dispatch(fetchTestsRequest());
  const fetchTest = (id: string) => dispatch(fetchTestRequest(id));
  const fetchSubjects = () => dispatch(fetchSubjectsRequest());
  const fetchTopics = (subjectId: string) => dispatch(fetchTopicsRequest(subjectId));
  const fetchSubTopics = (topicIds: string[]) => dispatch(fetchSubTopicsRequest(topicIds));

  const createTest = (testData: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch(createTestRequest(testData, resolve, reject));
    });

  const updateTest = (id: string, testData: any) =>
    new Promise<any>((resolve, reject) => {
      dispatch(updateTestRequest(id, testData, resolve, reject));
    });

  const deleteTest = (id: string) =>
    new Promise<any>((resolve, reject) => {
      dispatch(deleteTestRequest(id, resolve, reject));
    });

  return {
    ...testsState,
    fetchTests,
    fetchTest,
    fetchSubjects,
    fetchTopics,
    fetchSubTopics,
    createTest,
    updateTest,
    deleteTest
  };
};

// Export useQuestions hook wrapper over Redux
export const useQuestions = () => {
  const dispatch = useDispatch();
  const questionsState = useSelector((state: RootState) => state.questions);

  const createQuestions = (questions: any[]) =>
    new Promise<any>((resolve, reject) => {
      dispatch(createQuestionsRequest(questions, resolve, reject));
    });

  const fetchQuestionsBulk = (questionIds: string[]) => {
    dispatch(fetchQuestionsBulkRequest(questionIds));
  };

  return {
    ...questionsState,
    createQuestions,
    fetchQuestionsBulk
  };
};



