export interface User {
  userId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
}

export interface RootState {
  auth: AuthState;
  toast: ToastState;
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

