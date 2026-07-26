import * as actionTypes from './actionTypes';
import { Question } from '../types';

export const createQuestionsRequest = (questions: any[], resolve: (val: any) => void, reject: (err: any) => void) => ({
  type: actionTypes.CREATE_QUESTIONS_REQUEST,
  payload: { questions, resolve, reject }
});

export const createQuestionsSuccess = (questions: Question[]) => ({
  type: actionTypes.CREATE_QUESTIONS_SUCCESS,
  payload: questions
});

export const createQuestionsFailure = (error: string) => ({
  type: actionTypes.CREATE_QUESTIONS_FAILURE,
  payload: error
});

export const fetchQuestionsBulkRequest = (questionIds: string[]) => ({
  type: actionTypes.FETCH_QUESTIONS_BULK_REQUEST,
  payload: questionIds
});

export const fetchQuestionsBulkSuccess = (questions: Question[]) => ({
  type: actionTypes.FETCH_QUESTIONS_BULK_SUCCESS,
  payload: questions
});

export const fetchQuestionsBulkFailure = (error: string) => ({
  type: actionTypes.FETCH_QUESTIONS_BULK_FAILURE,
  payload: error
});
