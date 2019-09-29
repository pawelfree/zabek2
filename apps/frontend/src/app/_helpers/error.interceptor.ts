import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from '../common-dialogs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        const error = err.error.message || err.statusText;
        if ([401, 500].indexOf(err.status) !== -1) {
          this.store.dispatch(AuthActions.logout());
          let errorMessage = 'Wystąpił nieznany błąd';
          if (err.error.message) {
            errorMessage = err.error.message;
          }
          this.openErrorDialog(errorMessage, err.statusText);
          this.router.navigate(['/']);
        } else if ([401, 404].indexOf(err.status) !== -1) {
          this.openErrorDialog(err.error.message, err.statusText);
        }
        return throwError(error);
      })
    );
  }

  openErrorDialog(message: string, status: string) { 
    this.dialog.open(ErrorComponent, {
      data: { message, status }
    });
  }
}
