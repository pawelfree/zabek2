import { User } from '../../_models';
import * as AuthActions from './auth.actions'; 

export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
  returnUrl: string;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false,
  returnUrl: '/'

};

export function authReducer(state = initialState, action: AuthActions.AuthActions ) {
  switch(action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      return {
        ...state,
        authError: null,
        user: action.payload,
        isLoading: false
      }
    case AuthActions.LOGIN_START: {
      return {
        ...state,
        authError: null,
        isLoading: true,
        returnUrl: action.payload.returnUrl
      }
    }
    case AuthActions.AUTHENTICATE_FAIL: {
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
        user: null,
        returnUrl : '/'
      }
    case AuthActions.AUTHENTICATION_CLEAR_ERROR :
      return {
        ...state,
        authError: null,
        isLoading: false
      }
    default:
      return state;
  }

}