// System constants

export interface DifficultyLevel {
  value: string;
  label: string;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export interface TestType {
  value: string;
  label: string;
}

export const TEST_TYPES: TestType[] = [
  { value: 'chapterwise', label: 'Chapterwise Test' },
  { value: 'full_mock', label: 'Full Mock Test' },
  { value: 'topic_test', label: 'Topic Test' }
];

export const DEFAULT_MARKING_SCHEME = {
  correct: 4,
  wrong: -1,
  unattempt: 0
};

export const API_ENDPOINTS = {
  login: '/auth/login',
  subjects: '/subjects',
  topics: '/topics/subject',
  subTopics: '/sub-topics/topic',
  multiSubTopics: '/sub-topics/multi-topics',
  tests: '/tests',
  questions: '/questions/bulk',
  questionsFetch: '/questions/fetchBulk'
};
