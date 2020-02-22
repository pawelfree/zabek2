import { createAction, props } from '@ngrx/store';
import { User } from '@zabek/data'

export const loginStart = createAction('[Auth] Login start', props<{email: string, password: string, returnUrl: string}>()); 
export const authenticateSuccess = createAction('[Auth] Authenticate success', props<{user: User, redirect: boolean, returnUrl : string}>());
export const authenticateFail = createAction('[Auth] Authenticate fail',props<{error: string}>());
export const logout = createAction('[Auth] Logout');
export const autoLogin = createAction('[Auth] Auto Login');
export const authenticateClearError = createAction('[Auth] Clear error');
export const changePassword = createAction('[Auth] Change password', props<{oldPassword: string, newPassword: string}>());
export const passwordChanged = createAction('[Auth] Password changed');
export const passwordChangeError = createAction('[Auth] Password change error',props<{error: string}>());
export const sendPasswordResetTokenRequest = createAction('[Auth] Send password reset token request', props<{email: string}>());
export const passwordResetTokenRequestSent = createAction('[Auth] Password reset token request sent');
export const sendPasswordResetRequest = createAction('[Auth] Send password reset request', props<{token: string, password: string}>());
export const rulesAccepted = createAction('[Auth] Rules accepted');
export const renewTokenRequest = createAction('[Auth] Renew auth token request');
export const renewTokenSuccess = createAction('[Auth] Renew auth token success',props<{user: User}>());