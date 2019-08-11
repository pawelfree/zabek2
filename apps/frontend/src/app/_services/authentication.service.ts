import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticatedUser } from '../_models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<AuthenticatedUser>(
    JSON.parse(localStorage.getItem('currentUser'))
  );
  public currentUser: Observable<AuthenticatedUser>;
  private tokenTimer: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthenticatedUser {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthenticatedUser>('/api/user/authenticate', { email, password })
      .pipe(
        map(user => {
          if (user) {
            if (user.token) {
              const expiresInDuration = user.expiresIn;
              this.tokenTimer = setTimeout(() => {
                this.logout();
              }, expiresInDuration * 1000);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    clearTimeout(this.tokenTimer);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }
}
