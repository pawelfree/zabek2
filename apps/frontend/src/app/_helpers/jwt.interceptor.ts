import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_services';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    constructor(private authService: AuthenticationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
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