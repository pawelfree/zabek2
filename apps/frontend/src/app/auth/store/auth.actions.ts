import { Action } from '@ngrx/store';
import { User } from '../../_models'


export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';

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
  | Logout
  | AutoLogin;