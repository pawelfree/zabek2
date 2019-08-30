import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from '../_validators';
import { UserService } from '../_services';
import { InfoComponent } from '../info/info.component';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;

  constructor(private readonly dialogRef: MatDialogRef<ChangePasswordComponent>,
              private readonly userService: UserService,
              private readonly dialog: MatDialog) {}

  ngOnInit() {
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
    this.userService.me()
      .subscribe( user => {
        this.userService.changePassword({
          _id: user._id, 
          oldPassword: this.form.value.oldPassword, 
          newPassword: this.form.value.password1 })
        .subscribe(()=> {
          this.dialog.open(InfoComponent,{
            data: 'Hasło zostało zmienione'
          });
          this.dialogRef.close(); 
        })
      });
  }
}