import { User } from '../../_models';
import * as AuthActions from './auth.actions'; 

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions ) {
  switch(action.type) {
    case AuthActions.LOGIN:
      return {
        ...state,
        authError: null,
        user: Object.assign({}, action.payload),
        isLoading: false
      }
    case AuthActions.LOGIN_START: {
      return {
        ...state,
        authError: null,
        isLoading: true
      }
    }
    case AuthActions.LOGIN_FAIL: {
      return {
        ...state,
        user: null,
        authError: action.payload,
        isLoading: false
      }
    }
    case AuthActions.LOGOUT:
      return {
        ...state,
        authError: null,
        user: null
      }
    default:
      return state;
  }

}