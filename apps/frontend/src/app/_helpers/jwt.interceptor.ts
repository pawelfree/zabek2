import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { User } from '../_models';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor(private readonly store: Store<AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('amazon')) {
            return next.handle(req);
        }
        return this.store.select('auth').pipe(
            take(1),
            map(authState => authState.user),
            exhaustMap(user => {
                if (user && user.token) {
                    req = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${user.token}`
                        }
                    });
                }
                return next.handle(req);                
            })
        );
    }
}