import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from '../../_services';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CustomValidator } from '../../_validators';

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

  constructor(
    public userService: UserService,
    public route: ActivatedRoute
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

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.userService.addUser( {
        email: this.form.value.email,
        role: this.form.value.role,
        password: this.form.value.password1 }
      );
    } else {
      this.userService.updateUser({
        _id: this._id,
        email: this.form.value.email,
        role: this.form.value.role,
        password: this.form.value.password1}
      );
    }
    this.form.reset();
  }
}
