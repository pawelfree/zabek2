import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { tap, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { AuthActions } from '../store';
import { Role } from '@zabek/data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  private storeSub: Subscription;

  queryParams: Params = { id: '0' };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly store: Store<AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth')
    .pipe(
      //TODO przerobic na actions
      tap(authData => {
        const user = authData.user;  
        if (user) {
          if (user.role === Role.doctor) {
            this.router.navigate([`/doctor`]);
          } else {
            this.router.navigate(['/user']);
          }
        }
      })
    )
    .subscribe(authData => this.loading = authData.loading);

    this.route.queryParams.pipe(
      take(1)
    ).subscribe(params => {
      this.queryParams = params['id'] ? {id: params['id'] } : null;
    });

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(){
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  get f() {
    return this.loginForm.controls;
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
