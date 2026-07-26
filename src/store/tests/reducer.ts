import * as actionTypes from './actionTypes';
import { TestsState } from '../types';

const initialTestsState: TestsState = {
  tests: [],
  currentTest: null,
  subjects: [],
  topics: [],
  subTopics: [],
  loading: false,
  loadingCount: 0,
  error: null
};

export const testsReducer = (state = initialTestsState, action: any): TestsState => {
  switch (action.type) {
    case actionTypes.FETCH_TESTS_REQUEST:
    case actionTypes.FETCH_TEST_REQUEST:
    case actionTypes.CREATE_TEST_REQUEST:
    case actionTypes.UPDATE_TEST_REQUEST:
    case actionTypes.DELETE_TEST_REQUEST:
    case actionTypes.FETCH_SUBJECTS_REQUEST:
    case actionTypes.FETCH_TOPICS_REQUEST:
    case actionTypes.FETCH_SUBTOPICS_REQUEST: {
      const nextRequestCount = (state.loadingCount || 0) + 1;
      return {
        ...state,
        loadingCount: nextRequestCount,
        loading: nextRequestCount > 0,
        error: null
      };
    }

    case actionTypes.FETCH_TESTS_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        tests: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.FETCH_TEST_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        currentTest: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.CREATE_TEST_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        tests: [...state.tests, action.payload],
        currentTest: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.UPDATE_TEST_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        tests: state.tests.map(t => t.id === action.payload.id ? action.payload : t),
        currentTest: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.DELETE_TEST_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        tests: state.tests.filter(t => t.id !== action.payload),
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.FETCH_SUBJECTS_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        subjects: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.FETCH_TOPICS_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        topics: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.FETCH_SUBTOPICS_SUCCESS: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        subTopics: action.payload,
        loadingCount: nextCount,
        loading: nextCount > 0
      };
    }

    case actionTypes.FETCH_TESTS_FAILURE:
    case actionTypes.FETCH_TEST_FAILURE:
    case actionTypes.CREATE_TEST_FAILURE:
    case actionTypes.UPDATE_TEST_FAILURE:
    case actionTypes.DELETE_TEST_FAILURE:
    case actionTypes.FETCH_SUBJECTS_FAILURE:
    case actionTypes.FETCH_TOPICS_FAILURE:
    case actionTypes.FETCH_SUBTOPICS_FAILURE: {
      const nextCount = Math.max(0, (state.loadingCount || 0) - 1);
      return {
        ...state,
        loadingCount: nextCount,
        loading: nextCount > 0,
        error: action.payload
      };
    }

    default:
      return state;
  }
};

export default testsReducer;
