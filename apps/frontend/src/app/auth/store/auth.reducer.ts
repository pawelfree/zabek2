import { User } from '../../_models';
import * as AuthActions from './auth.actions'; 

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions ) {
  switch(action.type) {
    case AuthActions.LOGIN:
      return {
        ...state,
        user: Object.assign({}, action.payload)
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      }
    default:
      return state;
  }

}