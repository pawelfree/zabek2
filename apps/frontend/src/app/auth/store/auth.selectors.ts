import {createFeatureSelector, createSelector} from '@ngrx/store';
import { State } from './auth.reducer';


export const selectAuthState = createFeatureSelector<State>('auth');

export const currentUser = createSelector(
  selectAuthState,
  auth => auth.user
)