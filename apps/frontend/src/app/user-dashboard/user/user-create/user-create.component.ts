import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { CustomValidator } from '../../../_validators';
import { Role, Lab, User } from '@zabek/data';
import { MatDialog } from '@angular/material';
import { SelectLabComponent } from '../../select-lab/select-lab.component';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserState } from '../../store/user.reducer';
import { UserActions }from '../../store';
import { AppActions } from '../../../store';

@Component({
  selector: 'zabek-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  roles = [Role.admin, Role.user];
  private mode: 'create' | 'edit' = 'create';
  private _id: string;
  private storeSub: Subscription = null;

  constructor(    
    private readonly store: Store<UserState>,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    //TODO walidacja roli i takiego samego hasla
    this.form = new FormGroup({
        email: new FormControl(null, {
          validators: [Validators.required, Validators.email]
        }),
        role: new FormControl("user", {
          validators: [Validators.required]
        }),
        lab_name: new FormControl(null, {
         
        }),         
        lab: new FormControl(null, {
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

    this.storeSub = this.store.subscribe(state => {
      if (state.error) {
        this.store.dispatch(AppActions.raiseError({message: state.error, status: null}));
      }
    });

    const user = this.route.snapshot.data.user;
    if (user) {
      this._id = user._id;
      this.mode = 'edit';
      this.form.setValue({
        email: user.email,
        role: user.role,
        lab_name: user.lab.name,
        lab: user.lab,
        password1: '',
        password2: ''
      });
    } else {
      this._id = null;
      this.mode = 'create';
    } 
  }

  onSelectLab() {
    const dialogref = this.dialog.open(SelectLabComponent, {
      disableClose: true
    });

    dialogref.afterClosed()
      .subscribe(
        (lab: Lab) => { 
          this.form.patchValue({lab: lab, lab_name: lab.name});
        }
      );
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.storeSub = null;
    }
  }

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.store.dispatch(AppActions.loadingStart());
    const user = new User(
      this._id ? this._id : null,
      this.form.value.email,
      this.form.value.role,
      this.form.value.lab,
      this.form.value.password1);
    if (this.mode === "create") {
      this.store.dispatch(UserActions.addUser({user}));
    } else {
      this.store.dispatch(UserActions.updateUser({user}));
    }
  }
}
