import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { tap, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { Role } from '../../_models';
import { Subscription } from 'rxjs';
import { InfoComponent } from '../../common-dialogs';
import { MatDialog } from '@angular/material';
import { Actions, ofType } from '@ngrx/effects';
import { FnParam } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'zabek-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  authError  = '';
  returnUrl: string;

  private storeSub: Subscription;
  private closeSub: Subscription;
  private rulesSub: Subscription;

  queryParams: Params = { id: '0' };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
    private readonly actions$: Actions ) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth')
    .pipe(
      //TODO to chyba bedzie zbedne
      tap(authData => {
        const user = authData.user
        if (user) {
          let role = user.role;
          if (role === Role.sadmin) {
            role = Role.admin;
          }
          this.router.navigate([`/${role}`]);
        }
      })
    )
    .subscribe(authData => {
      this.loading = authData.loading;
      this.authError = authData.error;
      if (this.authError) {
        this.showErrorAlert(this.authError);
      }
    });

    
    this.rulesSub = this.actions$.pipe(
      ofType(AuthActions.acceptRules),
      tap(param => {
        this.dialog.open(InfoComponent,{ data: 'Musisz zaakceptowac regulamin. Trzeba dokonczyc ta funkcjonalnosc' });   
         this.store.dispatch(AuthActions.logout());
      }),
    ).subscribe();

    this.route.queryParams.pipe(
      take(1)
    ).subscribe(params => {
      this.queryParams = params['id'] ? {id: params['id'] } : null;
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(){
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.rulesSub) {
      this.rulesSub.unsubscribe();
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onHandleError() {
    this.store.dispatch(AuthActions.authenticateClearError());
  }

  private showErrorAlert(message: string) {
    this.dialog.open(InfoComponent, { data:  message });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.store.dispatch(AuthActions.loginStart({
      email: this.f.username.value,
      password: this.f.password.value,
      returnUrl: this.returnUrl
    }));
  }
}
