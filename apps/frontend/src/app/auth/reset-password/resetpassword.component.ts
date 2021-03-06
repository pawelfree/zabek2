import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidator } from '../../_validators';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { AuthActions } from '../store/';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'zabek-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  reset = false;
  loading = false;
  private storeSub: Subscription = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store<AppState>,
    private readonly actions$: Actions) {}

  ngOnInit() {

    this.storeSub = this.store.select('auth').subscribe(state => {
      this.loading = state.loading;
    });

    this.actions$.pipe(
      ofType(AuthActions.passwordResetTokenRequestSent),
      take(1),
      tap(() => this.router.navigate(['/']))
    ).subscribe();  
  
    this.actions$.pipe(
      ofType(AuthActions.passwordChanged),
      take(1),
      tap(() => this.router.navigate(['/']))
    ).subscribe();  

    const token = this.route.snapshot.data.token;
    if (token) {
      this.reset = true;
      this.form = new FormGroup({
          token: new FormControl(token, {
            validators: [Validators.required]
          }),
          password1: new FormControl(null, {
            validators: [ Validators.required, 
                          Validators.minLength(8),
                          CustomValidator.patternMatch(/\d/, {hasNumber: true}),
                          CustomValidator.patternMatch(/[A-Z]/, {hasCapitalCase: true}),
                          CustomValidator.patternMatch(/[a-z]/, {hasSmallCase: true}),
                          CustomValidator.patternMatch(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {hasSpecialCharacters: true})
                        ]
          }),
          password2: new FormControl(null, {
            validators: [Validators.required]
          }),
          },
          {
            validators: CustomValidator.mustMatch('password1', 'password2')
          });
    } else {
      this.reset = false;
      this.form = new FormGroup({
        email: new FormControl(null, {
          validators: [ Validators.required,
                        Validators.email]
        })
      })
    }
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.storeSub = null;
    }
  }

  onResetPassword() {
    this.store.dispatch(AuthActions.sendPasswordResetRequest({token: this.form.value.token, password: this.form.value.password1}));
  }

  onSubmitEmail(){
    this.store.dispatch(AuthActions.sendPasswordResetTokenRequest({email: this.form.value.email}))
  }
}