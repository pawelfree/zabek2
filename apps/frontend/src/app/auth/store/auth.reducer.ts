import { User } from '../../_models';
import * as AuthActions from './auth.actions'; 
import { createReducer, on } from '@ngrx/store';

export interface State {
  user: User;
  error: string;
  loading: boolean;
}

const initialState: State = {
  user: null,
  error: null,
  loading: false
};

const _authReducer = createReducer(initialState,
  on(AuthActions.authenticateSuccess, (state, {user, redirect, returnUrl} ) => ({...state, error: null, user, loading: false})),
  on(AuthActions.authenticateFail, (state, {error}) => ({...state, user: null, error: error, loading: false})),
  on(AuthActions.loginStart, state => ({...state, error: null, loading: true})),
  on(AuthActions.logout, state => ({...state, error: null, user: null, loading: false})),
  on(AuthActions.authenticateClearError, state => ({...state, error: null, loading: false})),
  on(AuthActions.changePassword, (state ,{oldPassword, newPassword}) => ({...state, error: null, loading: true})),
  on(AuthActions.passwordChanged, state => ({...state, error: null, loading: false})),
  on(AuthActions.passwordChangeError, (state, {error}) => ({...state, error, loading: false})),
  on(AuthActions.sendPasswordResetTokenRequest, (state, {email}) => ({...state, loading: true, error: null})),
  on(AuthActions.passwordResetTokenRequestSent, (state) => ({...state, error: null, loading: false})),
  on(AuthActions.sendPasswordResetRequest,(state, {token, password}) => ({...state, error: null, loading: true})),
  on(AuthActions.rulesAccepted, (state) => {
      const user = state.user;
      user.rulesAccepted = true;
      return {...state, error: null, loading: false, user}
    })
);

export function authReducer(state, action ) {
  return _authReducer(state, action);
}
