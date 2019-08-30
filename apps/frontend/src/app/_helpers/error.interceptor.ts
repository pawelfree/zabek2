import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_services';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../error/error.component';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        const error = err.error.message || err.statusText;
        if ([401, 403, 500].indexOf(err.status) !== -1) {
          this.authService.logout();
          let errorMessage = 'Wystąpił nieznany błąd';
          if (err.error.message) {
            errorMessage = err.error.message;
          }
          this.dialog.open(ErrorComponent, {
            data: { message: errorMessage, status: err.statusText }
          });
          this.router.navigate(['/']);
        } else if ([400, 404].indexOf(err.status) !== -1) {
          this.dialog.open(ErrorComponent, {
            data: { message: err.error.message, status: err.statusText }
          });
        }
        return throwError(error);
      })
    );
  }
}
