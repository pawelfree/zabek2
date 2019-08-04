import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_services';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../dialogs/error/error.component';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private readonly authService: AuthenticationService,
        private readonly dialog: MatDialog,
        private readonly router: Router
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(catchError(err => {
                const error = err.error.message || err.statusText;
                if ([401, 403].indexOf(err.status) !== -1 ) {
                    this.authService.logout();
                    let errorMessage = 'Wystąpił nieznany błąd';
                    if (err.error.message) {
                        errorMessage = err.error.message
                    }
                    this.dialog.open(ErrorComponent, {data: { message: errorMessage, status: err.statusText }});
                    console.log(err.statusText)
                    this.router.navigate(['/']);
                }
                return throwError(error);
            }));
    }

}