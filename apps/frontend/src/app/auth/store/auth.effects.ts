import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map, tap } from 'rxjs/operators'; 
import { AuthActions } from '.';
import { User, Role } from '@zabek/data';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { environment } from '../../../environments/environment';
import { AppActions } from '../../store';

const BACKEND_URL = environment.apiUrl + '/api/auth/';

const handleError = (errorRes: any) => {
  let error = 'Naprawdę nieznany błąd';
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
  authPasswordResetRequest$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.sendPasswordResetRequest),
    switchMap(props => {
      return this.http.post(BACKEND_URL+'passwordreset/'+props.token, {password: props.password}).pipe(
        map(res=> AuthActions.passwordChanged()),
        catchError(error => of(AuthActions.passwordChangeError({error})))
      )
    })
  ));

  authPassworResetTokenSent$ = this.actions$.pipe(
    ofType(AuthActions.passwordResetTokenRequestSent),
    map(() => AppActions.sendInfo({info: 'Żądanie zmiany hasła zostało wysłane. Sprawdź skrzynkę poczty.'}))
  );

  authSendPasswordResetRequest$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.sendPasswordResetTokenRequest),
    switchMap(props => {
      return this.http.post(BACKEND_URL+'passwordreset', props).pipe(
        map(res => AuthActions.passwordResetTokenRequestSent()),
        catchError(error => of(AuthActions.passwordChangeError({error})))
      )
    })
  ));

  authPasswordChanged$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.passwordChanged),
    map(() => AppActions.sendInfo({info: "Hasło zostało zmienione"}))
  ));

  authPasswordChangeError$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.passwordChangeError),
    switchMap(res => handleError(res.error))
  ));

  authAuthenticateFail$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.authenticateFail),
    map(res => AppActions.raiseError({message: res.error, status: null}))
  ));

  authChangePassword$ = createEffect(() => this.actions$.pipe(
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
          return AuthActions.authenticateSuccess({user, redirect: false, returnUrl: '/'});   
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
              return AuthActions.authenticateSuccess({user, redirect: true, returnUrl: authData.returnUrl});
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