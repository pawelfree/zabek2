import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../_models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  autoLogout(expirationDuration) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();  
    }, expirationDuration); 
  }

  autoLogin() {
    const user_from_localstorage = JSON.parse(localStorage.getItem('currentUser'));
    if (user_from_localstorage.token && user_from_localstorage.tokenExpirationDate) {
      this.user.next(user_from_localstorage);
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
              this.user.next(newUser);
            }
          }
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}
