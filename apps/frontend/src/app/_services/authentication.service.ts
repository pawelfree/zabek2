import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})
export class AuthenticationService {
    private currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    public currentUser: Observable<User>;
    private tokenTimer: any;

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

     login(email: string, password: string) {
        return this.http.post<User>('http://localhost:3001/api/user/authenticate', { email, password })
            .pipe(map(user => {
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
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        clearTimeout(this.tokenTimer);
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

}