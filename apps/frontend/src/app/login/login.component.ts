import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, take, map } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';

@Component({
  selector: 'zabek-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {

    this.authService.user.pipe(
      take(1),
      map(user => {
        if (user) {
          let role = user.role;
          if (role === Role.sadmin) {
            role = Role.admin;
          }
          this.router.navigate([`/${role}`]);
        }
      })
    );
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data: User) => {
          let role = data.role;
          if (role === Role.sadmin) {
            role = Role.admin;
          }
          this.router.navigate([role]);
        },
        err => {
          this.loading = false;
        }
      );
  }
}
