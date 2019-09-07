import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../_models';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenExpirationTimer: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {}

  autoLogout(expirationDuration) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();  
    }, expirationDuration); 
  }

  autoLogin() {
    const user_from_localstorage = JSON.parse(localStorage.getItem('currentUser'));
    if (user_from_localstorage && user_from_localstorage.token && user_from_localstorage.tokenExpirationDate) {
      this.store.dispatch(new AuthActions.Login(user_from_localstorage));
      const expirationDuration =
        new Date(user_from_localstorage.tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);      
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<User>('/api/user/authenticate', { email, password })
      .pipe(
        tap(user => {
          if (user) {
            if (user.token) {
              const expirationDate = new Date(new Date().getTime() + user.expiresIn * 1000);
              this.autoLogout(user.expiresIn * 1000);
              const newUser: User = {
                ...user,
                tokenExpirationDate: expirationDate
              }
              localStorage.setItem('currentUser', JSON.stringify(newUser));
              this.store.dispatch(new AuthActions.Login(newUser));
            }
          }
        })
      );
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}
