import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../_models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { map, tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { FeedbackService } from '../../_services';

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

  constructor(
    private router: Router,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog,
    private readonly feedbackService: FeedbackService
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
    // TODO:
    // 1. [DONE] Zapisz feedback w bazie
    // 2. [DONE] Wyślij email z info o zarejestrowaniu feedbacku na adres email użytkownika
    // 3. Wyslij email o zarejestrowaniu feedbacku na adres email pracowni/admina pracowni?

    const userFeedback = {
      _id: null,
      content: this.form.value.feedback,
      createdBy: this.currentUser.email,
      createdAt: this.formattedNow()
    };

    //zapisz feedback w bazie i wyslij email z potwierdzeniem
    this.feedbackService.addFeedback(userFeedback);
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

  // TODO do utilsów, zrobić leading 0 dla dni i miesięcy < 10
  private formattedNow() {
    const d = new Date();
    const curr_date = d.getDate();
    const curr_month = d.getMonth() + 1; //Months are zero based
    const curr_year = d.getFullYear();
    return (curr_year + '-' + curr_month +  '-' + curr_date);
  }
}
