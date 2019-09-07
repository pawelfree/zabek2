import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first, map } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'zabek-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private readonly store: Store<AppState>  ) {}

  ngOnInit() {
    this.store.select('auth').pipe(
      first(),
      map(authState => authState.user),
      map(user => {
        if (user) {
          let role = user.role;
          if (role === Role.sadmin) {
            role = Role.admin;
          }
          this.router.navigate([`/${role}`]);
        }
      })
    ).subscribe();

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
