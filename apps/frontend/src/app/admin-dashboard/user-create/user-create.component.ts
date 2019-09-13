import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from '../../_services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CustomValidator } from '../../_validators';
import { Role, Lab, User } from '../../_models';
import { MatDialog } from '@angular/material';
import { SelectLabComponent } from '../select-lab/select-lab.component';

@Component({
  selector: 'zabek-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private _id: string;
  roles = [Role.admin, Role.user];

  constructor(
    private readonly userService: UserService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    //TODO walidacja roli i takiego samego hasla
    this.form = new FormGroup({
        email: new FormControl(null, {
          validators: [Validators.required, Validators.email]
        }),
        role: new FormControl(null, {
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

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("userId")) {
        this.mode = "edit";
        this._id = paramMap.get("userId");
        this.isLoading = true;
        this.userService.getUser(this._id).subscribe(userData => {
          this.isLoading = false;
          this.form.setValue({
            email: userData.email,
            role: userData.role,
            lab_name: userData.lab.name,
            lab: userData.lab,
            password1: '',
            password2: ''
          });
        });
      } else {
        this.mode = "create";
        this._id = null;
      }
    });
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

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const user = new User(
      this._id ? this._id : "",
      this.form.value.email,
      this.form.value.role,
      this.form.value.lab,
      this.form.value.password1);
    if (this.mode === "create") {
      this.userService.addUser(user).subscribe(res => this.goOut());
    } else {
      this.userService.updateUser(user).subscribe(res => this.goOut());
    }
    this.isLoading = false;
    this.form.reset();
  }

  private goOut() {
    this.router.navigate(['/userlist']);
  }
}
