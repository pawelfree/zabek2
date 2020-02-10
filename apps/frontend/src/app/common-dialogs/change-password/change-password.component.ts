import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../_validators';
import { AuthActions } from '../../auth/store/';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  close$: Observable<boolean>;

  constructor(private readonly dialogRef: MatDialogRef<ChangePasswordComponent>,
              private readonly store: Store<AppState>,
              private readonly actions$: Actions) {}

  ngOnInit() {
    this.close$ = this.actions$.pipe(
      ofType(AuthActions.passwordChanged),
      tap(() => this.dialogRef.close()),
      map(() => true)
    );  

    this.form = new FormGroup({
      oldPassword: new FormControl(null, {
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
  }

  onChangePassword() {
    this.store.dispatch(AuthActions.changePassword({
      oldPassword: this.form.value.oldPassword, 
      newPassword: this.form.value.password1
    }));
  }
}