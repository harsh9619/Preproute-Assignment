import * as actionTypes from './actionTypes';
import { Test, Subject, Topic, SubTopic } from '../types';

export const fetchTestsRequest = () => ({
  type: actionTypes.FETCH_TESTS_REQUEST
});

export const fetchTestsSuccess = (tests: Test[]) => ({
  type: actionTypes.FETCH_TESTS_SUCCESS,
  payload: tests
});

export const fetchTestsFailure = (error: string) => ({
  type: actionTypes.FETCH_TESTS_FAILURE,
  payload: error
});

export const fetchTestRequest = (id: string) => ({
  type: actionTypes.FETCH_TEST_REQUEST,
  payload: id
});

export const fetchTestSuccess = (test: Test) => ({
  type: actionTypes.FETCH_TEST_SUCCESS,
  payload: test
});

export const fetchTestFailure = (error: string) => ({
  type: actionTypes.FETCH_TEST_FAILURE,
  payload: error
});

export const createTestRequest = (testData: any, resolve: (val: any) => void, reject: (err: any) => void) => ({
  type: actionTypes.CREATE_TEST_REQUEST,
  payload: { testData, resolve, reject }
});

export const createTestSuccess = (test: Test) => ({
  type: actionTypes.CREATE_TEST_SUCCESS,
  payload: test
});

export const createTestFailure = (error: string) => ({
  type: actionTypes.CREATE_TEST_FAILURE,
  payload: error
});

export const updateTestRequest = (id: string, testData: any, resolve: (val: any) => void, reject: (err: any) => void) => ({
  type: actionTypes.UPDATE_TEST_REQUEST,
  payload: { id, testData, resolve, reject }
});

export const updateTestSuccess = (test: Test) => ({
  type: actionTypes.UPDATE_TEST_SUCCESS,
  payload: test
});

export const updateTestFailure = (error: string) => ({
  type: actionTypes.UPDATE_TEST_FAILURE,
  payload: error
});

export const deleteTestRequest = (id: string, resolve: (val: any) => void, reject: (err: any) => void) => ({
  type: actionTypes.DELETE_TEST_REQUEST,
  payload: { id, resolve, reject }
});

export const deleteTestSuccess = (id: string) => ({
  type: actionTypes.DELETE_TEST_SUCCESS,
  payload: id
});

export const deleteTestFailure = (error: string) => ({
  type: actionTypes.DELETE_TEST_FAILURE,
  payload: error
});

export const fetchSubjectsRequest = () => ({
  type: actionTypes.FETCH_SUBJECTS_REQUEST
});

export const fetchSubjectsSuccess = (subjects: Subject[]) => ({
  type: actionTypes.FETCH_SUBJECTS_SUCCESS,
  payload: subjects
});

export const fetchSubjectsFailure = (error: string) => ({
  type: actionTypes.FETCH_SUBJECTS_FAILURE,
  payload: error
});

export const fetchTopicsRequest = (subjectId: string) => ({
  type: actionTypes.FETCH_TOPICS_REQUEST,
  payload: subjectId
});

export const fetchTopicsSuccess = (topics: Topic[]) => ({
  type: actionTypes.FETCH_TOPICS_SUCCESS,
  payload: topics
});

export const fetchTopicsFailure = (error: string) => ({
  type: actionTypes.FETCH_TOPICS_FAILURE,
  payload: error
});

export const fetchSubTopicsRequest = (topicIds: string[]) => ({
  type: actionTypes.FETCH_SUBTOPICS_REQUEST,
  payload: topicIds
});

export const fetchSubTopicsSuccess = (subTopics: SubTopic[]) => ({
  type: actionTypes.FETCH_SUBTOPICS_SUCCESS,
  payload: subTopics
});

export const fetchSubTopicsFailure = (error: string) => ({
  type: actionTypes.FETCH_SUBTOPICS_FAILURE,
  payload: error
});
