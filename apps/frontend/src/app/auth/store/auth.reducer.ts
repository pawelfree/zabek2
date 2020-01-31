import { User } from '@zabek/data';
import { AuthActions } from '.'; 
import { createReducer, on } from '@ngrx/store';

export interface State {
  user: User;
  loading: boolean;
}

const initialState: State = {
  user: null,
  loading: false
};

const _authReducer = createReducer(initialState,
  on(AuthActions.authenticateSuccess, (state, {user, redirect, returnUrl} ) => ({...state, user, loading: false})),
  on(AuthActions.authenticateFail, (state, {error}) => ({...state, user: null, loading: false})),
  on(AuthActions.loginStart, state => ({...state, loading: true})),
  on(AuthActions.logout, state => ({...state, user: null, loading: false})),
  on(AuthActions.authenticateClearError, state => ({...state, loading: false})),
  on(AuthActions.changePassword, (state ,{oldPassword, newPassword}) => ({...state, loading: true})),
  on(AuthActions.passwordChanged, state => ({...state, loading: false})),
  on(AuthActions.passwordChangeError, (state, {error}) => ({...state, loading: false})),
  on(AuthActions.sendPasswordResetTokenRequest, (state, {email}) => ({...state, loading: true })),
  on(AuthActions.passwordResetTokenRequestSent, (state) => ({...state, loading: false})),
  on(AuthActions.sendPasswordResetRequest,(state, {token, password}) => ({...state, loading: true})),
  on(AuthActions.rulesAccepted, (state) => {
      const user = Object.assign(new User(), {...state.user, rulesAccepted: true});
      return {...state, loading: false, user}
    })
);

export function authReducer(state, action ) {
  return _authReducer(state, action);
}
