import { createSelector} from '@ngrx/store';
import { selectUserDashboardState } from './user-dashboard.selectors';

export const selectUserState = createSelector(
  selectUserDashboardState,
  state => state.user
);
