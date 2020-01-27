import { ActionReducerMap, createReducer, on } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as AppActions from './app.actions';

export interface LoadingState {
  loading: boolean
}

const initialLoadingState: LoadingState = {
  loading: false
}

export interface AppState {
  auth: fromAuth.State;
  loading: LoadingState
}

const _appStateReducer = createReducer(initialLoadingState,
  on(AppActions.loadingStart,(state) => ({...state, loading: true})),
  on(AppActions.loadingEnd,(state) => ({...state, loading: false})),
);

export function appStateReducer(state, action) {
  return _appStateReducer(state, action);
}


export const appReducer: ActionReducerMap<AppState> = {
   auth: fromAuth.authReducer,
   loading: appStateReducer,
 };
