import {createFeatureSelector, createSelector} from '@ngrx/store';
import { GlobalState } from './app.reducer';


export const selectGlobalState = createFeatureSelector<GlobalState>('global');

export const selectLoading = createSelector(
  selectGlobalState,
  state => state.loading
);

export const selectError = createSelector(
  selectGlobalState,
  state => state.error
);

export const selectInfo = createSelector(
  selectGlobalState,
  state => state.info
);