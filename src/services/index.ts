import { authService } from './auth.service';
import { testsService } from './tests.service';
import { questionsService } from './questions.service';

export const api = {
  ...authService,
  ...testsService,
  ...questionsService,
};
