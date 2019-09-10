import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map, tap } from 'rxjs/operators'; 
import * as AuthActions from './auth.actions';
import { User, Role } from '../../_models';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services';

@Injectable()
export class AuthEffects {

  @Effect()
  authAutoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const user_from_localstorage = JSON.parse(localStorage.getItem('currentUser'));
      if (user_from_localstorage && user_from_localstorage.token && user_from_localstorage.tokenExpirationDate) {
        const expirationDuration =
          new Date(user_from_localstorage.tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.Login(user_from_localstorage);   
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
          const user: User = {
            ...resData,
            tokenExpirationDate: expirationDate
          }
          localStorage.setItem('currentUser', JSON.stringify(user));          
          return new AuthActions.Login(user);
        }),
        catchError(error => {
          return of(new AuthActions.LoginFail("nieoczekiwany blad - " + error))
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
    ofType(AuthActions.LOGIN),
    tap((authData: AuthActions.Login) => {
      const user = authData.payload;
      if (user) {
        let role = user.role;
        if (role === Role.sadmin) {
          role = Role.admin;
        }
        this.router.navigate([`/${role}`]);
      } else 
        this.router.navigate(['/']);
    })
  )

  constructor(
    private readonly actions$: Actions,
    private readonly http: HttpClient,
    private readonly authService: AuthenticationService,
    private readonly router: Router ) {}
}