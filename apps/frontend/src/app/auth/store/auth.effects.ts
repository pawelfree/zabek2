import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map, tap, withLatestFrom } from 'rxjs/operators'; 
import * as AuthActions from './auth.actions';
import { User, Role } from '../../_models';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { AppState } from '../../store/app.reducer';
import { Store } from '@ngrx/store';

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
  switch (errorRes) {
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Użytkownik nie istnieje.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Wprowadzone hasło jest niepoprawne.';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authAutoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
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
          userData._token) 
        if (user && user.token) {
          const expirationDuration = user.tokenExpirationDate.getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess({user, redirect: false, returnUrl: '/'});   
        }
      }
      return { type: 'DUMMY' }
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<User>('/api/user/authenticate', { 
        email: authData.payload.email, 
        password: authData.payload.password })
      .pipe(
        tap(resData => this.authService.setLogoutTimer(resData.expiresIn * 1000)),
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + resData.expiresIn * 1000);
          const user: User = new User(
            resData._id, 
            resData.email, 
            resData.role, 
            resData.lab,
            "",
            resData.expiresIn,
            expirationDate,
            resData.token);
          localStorage.setItem('currentUser', JSON.stringify(user));        
          return new AuthActions.AuthenticateSuccess({ user, redirect: true, returnUrl: authData.payload.returnUrl});
        }),
        catchError(error => {
          return (handleError(error))
        })

      )
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('currentUser');
      this.router.navigate(['/']);
    })
  );

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((action:AuthActions.AuthenticateSuccess) => {
      const returnUrl = action.payload.returnUrl;
      const redirect = action.payload.redirect;
      const user = action.payload.user;
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
  );

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly authService: AuthenticationService,
    private readonly router: Router ) {}
}