import {
  ReactNode,
} from 'react';

export interface User {
  userId: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface TestsState {
  tests: Test[];
  currentTest: Test | null;
  subjects: Subject[];
  topics: Topic[];
  subTopics: SubTopic[];
  loading: boolean;
  loadingCount?: number;
  error: string | null;
}

export interface QuestionsState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  tests: TestsState;
  questions: QuestionsState;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface Question {
  id?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  media_url?: string;
  topic?: string;
  sub_topic?: string;
}

export interface Test {
  id: string;
  name: string;
  subject: string;
  subjectName?: string;
  subject_id?: string;
  type: 'chapterwise' | 'full_mock' | 'topic_test';
  difficulty: 'easy' | 'medium' | 'hard';
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  topics: string[];
  sub_topics: string[];
  questions: string[];
  status: 'draft' | 'live';
  created_at: string;
  total_questions?: number;
}

export interface NoDataComponentProps {
  message: string | ReactNode,
  className: string,
  description?: string
  showErrorIcon?: boolean;
  img?: string;
}

export interface DashboardViewProps {
  tests: Test[];
  subjects: Subject[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedSubject: string;
  setSelectedSubject: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  deleteId: string | null;
  setDeleteId: (val: string | null) => void;
  viewTest: Test | null;
  setViewTest: (val: Test | null) => void;
  viewQuestions: Question[];
  viewLoading: boolean;
  totalTests: number;
  liveTests: number;
  draftTests: number;
  totalQuestions: number;
  filteredTests: Test[];
  handleDeleteClick: (id: string, e: React.MouseEvent) => void;
  handleConfirmDelete: () => void;
  handleViewClick: (testId: string, e: React.MouseEvent) => void;
  navigate: (path: string) => void;
}

export interface TestFormData {
  name: string;
  subject: string;
  type: 'chapterwise' | 'full_mock' | 'topic_test';
  topics: string[];
  sub_topics: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  total_questions: number;
}

export interface CreateTestViewProps {
  isEditMode: boolean;
  testId?: string;
  formData: TestFormData;
  setFormData: React.Dispatch<React.SetStateAction<TestFormData>>;
  subjects: Subject[];
  topics: Topic[];
  subTopics: SubTopic[];
  loading: boolean;
  errors: Record<string, string>;
  isSaving: boolean;
  onNextAddQuestions: () => void;
  onCancel: () => void;
  onSaveAsDraft: () => void;
}

export interface LocalQuestion extends Question {
  type: string;
  test_id?: string;
  topic_id?: string;
  sub_topic_id?: string;
  subject?: string;
}

export interface AddQuestionsViewProps {
  testId: string | undefined;
  test: Test | null;
  subjectName: string;
  topicOptions: Topic[];
  subTopicOptions: SubTopic[];
  loading: boolean;
  questions: LocalQuestion[];
  activeQuestionIndex: number;
  handleSelectQuestionSlot: (idx: number) => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleDeleteAllEdits: () => void;
  handleDeleteQuestion: (idx: number) => void;
  handleAddNewQuestion: () => void;
  qText: string;
  setQText: (val: string) => void;
  opt1: string;
  setOpt1: (val: string) => void;
  opt2: string;
  setOpt2: (val: string) => void;
  opt3: string;
  setOpt3: (val: string) => void;
  opt4: string;
  setOpt4: (val: string) => void;
  correctOpt: string;
  setCorrectOpt: (val: string) => void;
  explanation: string;
  setExplanation: (val: string) => void;
  qDifficulty: 'easy' | 'medium' | 'hard';
  setQDifficulty: (val: 'easy' | 'medium' | 'hard') => void;
  qTopic: string;
  setQTopic: (val: string) => void;
  qSubTopic: string;
  setQSubTopic: (val: string) => void;
  mediaUrl: string;
  setMediaUrl: (val: string) => void;
  errors: {
    qText?: string;
    opt1?: string;
    opt2?: string;
    opt3?: string;
    opt4?: string;
  };
  handleSaveAndContinue: () => void;
  handlePublish: () => void;
}

export interface QuestionFormErrors {
  qText?: string;
  opt1?: string;
  opt2?: string;
  opt3?: string;
  opt4?: string;
}

export interface PreviewPublishViewProps {
  testId: string | undefined;
  test: Test | null;
  subjectName: string;
  topicsNames: string[];
  questions: Question[];
  loading: boolean;
  publishing: boolean;
  expandedIndices: number[];
  toggleAccordion: (idx: number) => void;
  handlePublish: () => void;
  publishTab: 'now' | 'schedule';
  setPublishTab: (tab: 'now' | 'schedule') => void;
}

