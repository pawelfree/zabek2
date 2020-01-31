import { createSelector} from '@ngrx/store';
import { selectUserDashboardState } from './user-dashboard.selectors';

export const selectLabState = createSelector(
  selectUserDashboardState,
  state => state.lab
);

