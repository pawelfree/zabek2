import { ActionReducerMap } from '@ngrx/store';

import * as fromLab from './lab.reducer';
import * as fromUser from './user.reducer';

export interface UserDashboardState {
  user: fromUser.UserState;
  lab: fromLab.LabState;
}

export const userDashboardReducer: ActionReducerMap<UserDashboardState> = {
   user: fromUser.userReducer,
   lab: fromLab.labReducer,
 };
