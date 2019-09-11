import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import { Role } from '../_models';
import { Subscription } from 'rxjs';
import { InfoComponent } from '../common-dialogs';
import { MatDialog } from '@angular/material';

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>  ) {}

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
      this.loading = authData.isLoading;
      this.authError = authData.authError;
      if (this.authError) {
        this.showErrorAlert(this.authError);
      }
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
  }

  get f() {
    return this.loginForm.controls;
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    this.dialog.open(InfoComponent, { data:  message });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.store.dispatch( new AuthActions.LoginStart({
      email: this.f.username.value,
      password: this.f.password.value,
      returnUrl: this.returnUrl
    }));
  }
}
