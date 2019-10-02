import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map, tap } from 'rxjs/operators'; 
import * as AuthActions from './auth.actions';
import { User, Role, Doctor } from '../../_models';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/auth/';

const handleError = (errorRes: any) => {
  let error = 'An unknown error occurred!';
  if (!errorRes) {
    return of(AuthActions.authenticateFail({error}));
  }
  switch (errorRes) {
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      error = 'Błędny użytkownik lub hasło';
      break;
    case 'USER_NOT_ACTIVE':
      error = 'Użytkownik nie jest aktywny.';
      break;
    default:
      error = 'Nieznany błąd';
  }
  return of(AuthActions.authenticateFail({error}));
};

@Injectable()
export class AuthEffects {

  authAcceptRules$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.acceptRules),
    map(() => AuthActions.logout())
  ))

  authPasswordResetRequest$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.sendPasswordResetRequest),
    switchMap(props => {
      return this.http.post(BACKEND_URL+'passwordreset/'+props.token, {password: props.password}).pipe(
        map(res=> AuthActions.passwordChanged()),
        catchError(error => of(AuthActions.passwordChangeError({error})))
      )
    })
  ));

  authSendPasswordResetRequest$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.sendPasswordResetTokenRequest),
    switchMap(props => {
      return this.http.post(BACKEND_URL+'passwordreset', props).pipe(
        map(res => AuthActions.passwordResetTokenRequestSent()),
        catchError(error => of(AuthActions.passwordChangeError({error})))
      )
    })
  ));

  autchChangePassword$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.changePassword),
    switchMap(props => {
      return this.http.post(BACKEND_URL+'changepassword', props).pipe(
        map(res => AuthActions.passwordChanged()),
        catchError(error => of(AuthActions.passwordChangeError({error})))
      );
    })
  ));

  authAutoLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.autoLogin),
    map(() => {
      const userData = JSON.parse(localStorage.getItem('currentUser'));
      if (userData) {
        const user = new User(
          userData._id, 
          userData.email, 
          userData.role, 
          userData.lab,
          "", 
          userData.expiresIn,
          new Date(userData._tokenExpirationDate),
          userData._token,
          userData.active,
          userData.rulesAccepted) 
        if (user && user.token) {
          const expirationDuration = user.tokenExpirationDate.getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          if (user.role !== Role.doctor || user.rulesAccepted) {
            return AuthActions.authenticateSuccess({user, redirect: false, returnUrl: '/'});   
          } else {
            return AuthActions.acceptRules({user, redirect: true, returnUrl: '/'});           
          }
        }
      }
      return { type: 'DUMMY' }
    })
  ));

  authLoginStart$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap((authData) => {
      return this.http.post<User>(BACKEND_URL + 'authenticate', { 
        email: authData.email, 
        password: authData.password })
      .pipe(
        tap(resData => {
          if (resData.role !== Role.doctor || resData.rulesAccepted) {
            this.authService.setLogoutTimer(resData.expiresIn * 1000)
          }
        }),
        map(resData => {
            const expirationDate = new Date(new Date().getTime() + resData.expiresIn * 1000);
            const user: User = new User (
              resData._id, 
              resData.email, 
              resData.role, 
              resData.lab,
              "",
              resData.expiresIn,
              expirationDate,
              resData.token,
              resData.active,
              resData.rulesAccepted);
            localStorage.setItem('currentUser', JSON.stringify(user));        
            if (resData.role !== Role.doctor || resData.rulesAccepted) {
              return AuthActions.authenticateSuccess({user, redirect: true, returnUrl: authData.returnUrl});
            } else {
              return AuthActions.acceptRules({user, redirect: true, returnUrl: authData.returnUrl});
            }
        }),
        catchError(error => {
          return (handleError(error))
        })
      )
    })
  ));

  authLogout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('currentUser');
      this.router.navigate(['/']);
    })
  ),
  { dispatch: false });

  authSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.authenticateSuccess),
    tap(action => {
      const returnUrl = action.returnUrl;
      const redirect = action.redirect;
      const user = action.user;
      if (!user) {
        this.router.navigate(['/']);
      } else {
        let role = user.role;
        if (role === Role.sadmin) {
          role = Role.admin;
        }
        if (redirect) {
          if (returnUrl === '/') {
            this.router.navigate([`/${role}`]);
            } else {
              this.router.navigate([returnUrl]);
          }
        }
      }
    })
  ), 
  {dispatch: false});

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly authService: AuthenticationService,
    private readonly router: Router ) {}
}