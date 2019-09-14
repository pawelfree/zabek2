import { createEffect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map, tap } from 'rxjs/operators'; 
import * as AuthActions from './auth.actions';
import { User, Role } from '../../_models';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services';

const handleError = (errorRes: any) => {
  let error = 'An unknown error occurred!';
  if (!errorRes) {
    return of(AuthActions.authenticateFail({error}));
  }
  switch (errorRes) {
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      error = 'Błędny użytkownik lub hasłp';
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
          userData._token) 
        if (user && user.token) {
          const expirationDuration = user.tokenExpirationDate.getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.authenticateSuccess({user, redirect: false, returnUrl: '/'});   
        }
      }
      return { type: 'DUMMY' }
    })
  ));

  authLogin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginStart),
    switchMap((authData) => {
      return this.http.post<User>('/api/user/authenticate', { 
        email: authData.email, 
        password: authData.password })
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
          return AuthActions.authenticateSuccess({ user, redirect: true, returnUrl: authData.returnUrl});
        }),
        catchError(error => {
          return (handleError(error))
        })

      )
    })
  ));

  authLogout$ = createEffect(()=> this.actions$.pipe(
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