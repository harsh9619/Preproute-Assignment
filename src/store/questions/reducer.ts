import * as actionTypes from './actionTypes';
import { QuestionsState } from '../types';

const initialQuestionsState: QuestionsState = {
  questions: [],
  loading: false,
  error: null
};

export const questionsReducer = (state = initialQuestionsState, action: any): QuestionsState => {
  switch (action.type) {
    case actionTypes.CREATE_QUESTIONS_REQUEST:
    case actionTypes.FETCH_QUESTIONS_BULK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case actionTypes.CREATE_QUESTIONS_SUCCESS:
    case actionTypes.FETCH_QUESTIONS_BULK_SUCCESS:
      return {
        ...state,
        questions: action.payload,
        loading: false
      };

    case actionTypes.CREATE_QUESTIONS_FAILURE:
    case actionTypes.FETCH_QUESTIONS_BULK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default questionsReducer;
