import { ActionReducerMap, createReducer, on } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as AppActions from './app.actions';

export interface GlobalState {
  loading: boolean,
  error: {message : string, status: string},
  info: string
}

const initialGlobalState: GlobalState = {
  loading: false,
  error: null,
  info: null
}

export interface AppState {
  auth: fromAuth.State;
  global: GlobalState
}

const _appStateReducer = createReducer(initialGlobalState,
  on(AppActions.loadingStart,(state) => ({...state, loading: true})),
  on(AppActions.loadingEnd,(state) => ({...state, loading: false})),
  on(AppActions.raiseError,(state, error) => ({...state, error})),
  on(AppActions.clearError,(state) => ({...state, error: null})),
  on(AppActions.sendInfo,(state,{info}) => ({...state, info})),
  on(AppActions.clearInfo,(state) => ({...state, info: null}))
);

export function appStateReducer(state, action) {
  return _appStateReducer(state, action);
}


export const appReducer: ActionReducerMap<AppState> = {
   auth: fromAuth.authReducer,
   global: appStateReducer,
 };
