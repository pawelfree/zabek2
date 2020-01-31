import { createFeatureSelector } from '@ngrx/store';
import { UserDashboardState } from './user-dashboard.reducer';

export const selectUserDashboardState = createFeatureSelector<UserDashboardState>('user-dashboard');
