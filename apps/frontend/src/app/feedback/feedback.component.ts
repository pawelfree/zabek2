import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, Role } from '../_models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { map, tap } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InfoComponent } from '../common-dialogs';
import { MatDialog } from '@angular/material';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

@Component({
  selector: 'zabek-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  currentUser: User;
  subscription: Subscription;
  isLoading = false;
  form: FormGroup;

  sendTo: string;
  subject: string;
  body: string;

  constructor(
    private router: Router,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.isLoading = false;
    this.form = new FormGroup({
      feedback: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(1500)
        ]
      })
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    //wyślij feedback na adres email

    console.log(this.form);
    // this.emailService.send(sendTo, subject, body).subscribe(
    //   res => this.goOut(),
    //   tap(() => {
    //     this.dialog.open(InfoComponent,{ data: 'Twoje uwagi zostały wysłane.' });
    //     this.router.navigate(['/doctor/examinations']);
    //   }),
    //   err => {
    //     this.dialog.open(InfoComponent, { data: err });
    //   }
    // );

    this.isLoading = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  authorized(roles: string[]) {
    return this.currentUser && roles.indexOf(this.currentUser.role) !== -1;
  }

  get isLoggedIn() {
    return this.currentUser;
  }

  private goOut() {
    this.router.navigate(['/doctor/feedbackconfirmation']);
  }
}
