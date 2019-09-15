import { User } from '../../_models';
import * as AuthActions from './auth.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false
};

const _authReducer = createReducer(initialState,
  on(AuthActions.authenticateSuccess, (state, {user, redirect, returnUrl} ) => ({...state, authError: null, user, isLoading: false})),
  on(AuthActions.authenticateFail, (state, {error}) => ({...state, user: null, authError: error, isLoading: false})),
  on(AuthActions.loginStart, state => ({...state, authError: null, isLoading: true})),
  on(AuthActions.logout, state => ({...state, authError: null, user: null, isLoading: false})),
  on(AuthActions.authenticateClearError, state => ({...state, authError: null, isLoading: false}))
);

export function authReducer(state, action ) {
  return _authReducer(state, action);
}
