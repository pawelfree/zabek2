import { createAction, props } from '@ngrx/store';
import { User } from '../../_models'

export const loginStart = createAction('[Auth] Login start', props<{email: string, password: string, returnUrl: string}>()); 
export const authenticateSuccess = createAction('[Auth] Authenticate success', props<{user: User, redirect: boolean, returnUrl : string}>());
export const authenticateFail = createAction('[Auth] Authenticate fail', props<{error: string}>());
export const logout = createAction('[Auth] Logout');
export const autoLogin = createAction('[Auth] Auto Login');
export const authenticateClearError = createAction('[Auth] Clear error');
