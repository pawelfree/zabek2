import { Action } from '@ngrx/store';
import { User } from '../../_models'


export const LOGIN_START = '[Auth] Login start'; 
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate fail';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTHENTICATION_CLEAR_ERROR = '[Auth] Clear error';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {email: string, password: string, returnUrl: string}) {}
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {}
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload: User) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;

}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;

}

export class ClearError implements Action {
  readonly type = AUTHENTICATION_CLEAR_ERROR;

}

export type AuthActions =
    AuthenticateSuccess
  | AuthenticateFail
  | LoginStart
  | Logout
  | AutoLogin
  | ClearError;