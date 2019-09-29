import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducer';
import * as fromLab from '../admin-dashboard/lab/store/lab.reducer';
import * as fromUser from '../admin-dashboard/user/store/user.reducer';

export interface AppState {
   auth: fromAuth.State;
   lab: fromLab.State;
   user: fromUser.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  lab: fromLab.labReducer,
  user: fromUser.userReducer
};
