import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { take, map } from 'rxjs/operators';
import { Role } from '../_models';
import { MatDialog } from '@angular/material';
import * as AuthActions from '../auth/store/auth.actions';
import { DoctorService } from '../_services';
import { AcceptRulesComponent } from '../common-dialogs/accept-rules/accept-rules.component';

@Injectable({ providedIn: 'root'})
export class RulesGuard implements CanActivate {

    constructor(
      public dialog: MatDialog,
      private readonly store: Store<AppState>,
      private readonly doctorService: DoctorService
    ) {}


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.store.select('auth').pipe(
        take(1),
        map(authState => authState.user),
        map(user => {
            if (user && user.role === Role.doctor && user.rulesAccepted === false) {

              const dialogRef = this.dialog.open(AcceptRulesComponent, { width: '450px' });
              dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
                if (result) {
                  this.doctorService.acceptRules(user._id).pipe(take(1)).subscribe();
                  this.store.dispatch(AuthActions.rulesAccepted());
                  return true;
                } else {
                  this.store.dispatch(AuthActions.logout());
                }
              });
            }
            return true
        })
    );
    }
}