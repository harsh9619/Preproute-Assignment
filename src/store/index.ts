import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './types';

// Import module reducers
import authReducer from './auth/reducer';

// Import module sagas
import { watchAuth } from './auth/saga';

// Import actions for custom hooks
import { loginRequest, logout as logoutAction } from './auth/actions';

// Re-export actions for convenience
export * from './auth/actions';

// Root Reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// Root Saga
function* rootSaga(): Generator<any, void, any> {
  yield all([
    watchAuth(),
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
    new Promise<{ success: boolean; message?: string }>((resolve, reject) => {
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


