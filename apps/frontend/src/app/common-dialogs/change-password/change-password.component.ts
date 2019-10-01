import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../../_validators';
import { InfoComponent } from '../info/info.component';
import * as AuthActions from '../../auth/store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { Subscription } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private storeSub: Subscription = null;
  private changePasswordSub: Subscription = null;

  constructor(private readonly dialogRef: MatDialogRef<ChangePasswordComponent>,
              private readonly store: Store<AppState>,
              private readonly actions$: Actions,
              private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(state => {
      if (state.error) {
        switch(state.error) {
          case('INVALID_PASSWORD'): 
            this.form.patchValue({oldPassword: ''})
            this.dialog.open(InfoComponent,{ data: 'Błędne hasło.' });
            break;
          default:
            this.dialog.open(InfoComponent,{ data: 'Wystąpił nieoczekiwany błąd.' });
            this.form.reset();
        }
      }
    });

    this.changePasswordSub = this.actions$.pipe(
      ofType(AuthActions.passwordChanged),
      tap(() => {
        this.dialog.open(InfoComponent,{ data: 'Hasło zostało zmienione.' });
        this.dialogRef.close();
      })
    ).subscribe();  

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

  ngOnDestroy(){
    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.storeSub = null;
    }
    if (this.changePasswordSub) {
      this.changePasswordSub.unsubscribe();
      this.changePasswordSub = null;
    }
  }

  onChangePassword() {
    this.store.dispatch(AuthActions.changePassword({
      oldPassword: this.form.value.oldPassword, 
      newPassword: this.form.value.password1
    }));
  }
}