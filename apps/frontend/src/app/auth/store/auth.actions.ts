import { Action } from '@ngrx/store';
import { User } from '../../_models'


export const LOGIN_START = '[Auth] Login start'; 
export const LOGIN = '[Auth] Login';
export const LOGIN_FAIL = '[Auth] Login fail';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: {email: string, password: string}) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: string) {}
}

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: User) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;

}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;

}

export type AuthActions =
    Login
  | LoginStart
  | LoginFail
  | Logout
  | AutoLogin;