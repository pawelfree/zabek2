import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnInit {
  user = new BehaviorSubject<User>(null);
  private tokenTimer: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  ngOnInit(){
    this.user.next(JSON.parse(localStorage.getItem('currentUser')))
  }

  login(email: string, password: string) {
    return this.http
      .post<User>('/api/user/authenticate', { email, password })
      .pipe(
        map(user => {
          if (user) {
            if (user.token) {
              //const expiresInDuration = user.expiresIn;
              //TODO change
              const expiresInDuration = 900;
              this.tokenTimer = setTimeout(() => {
                this.logout();
              }, expiresInDuration * 1000);
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.user.next(user);
            }
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    clearTimeout(this.tokenTimer);
    this.user.next(null);
    this.router.navigate(['/']);
  }
}
