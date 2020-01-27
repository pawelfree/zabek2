import {createFeatureSelector, createSelector} from '@ngrx/store';
import { LoadingState } from './app.reducer';


export const selectLoadingState = createFeatureSelector<LoadingState>('loading');

export const selectLoading = createSelector(
  selectLoadingState,
  state => state.loading
);