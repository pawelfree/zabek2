import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { first } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { User } from '../_models';

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
      private authenticationService: AuthenticationService
  ) { 
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) { 
          this.router.navigate([`/${this.authenticationService.currentUserValue.role}`]);
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit() {

      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              (data: User) => {
                this.router.navigate([data.role]);
          },
          err => {
            this.loading = false;
          });
  }
}