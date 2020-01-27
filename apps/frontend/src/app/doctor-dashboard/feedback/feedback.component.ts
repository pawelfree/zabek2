import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FeedbackService } from '../../_services';
import { currentUser } from '../../auth/store';
import { tap, take } from 'rxjs/operators';
import { Feedback } from '@zabek/data';
// import { Feedback } from '@zabek/data';

@Component({
  selector: 'zabek-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  private currentUserEmail: string;
  form: FormGroup;

  constructor(
    private readonly store: Store<AppState>,
    private readonly feedbackService: FeedbackService
  ) {}

  ngOnInit() {
    this.store.pipe(
      select(currentUser),
      take(1),
      tap(user => this.currentUserEmail = user.email)).subscribe();

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

    // TODO:
    // 1. [DONE] Zapisz feedback w bazie
    // 2. [DONE] Wyślij email z info o zarejestrowaniu feedbacku na adres email użytkownika
    // 3. Wyslij email o zarejestrowaniu feedbacku na adres email pracowni/admina pracowni?

    const userFeedback: Feedback = {
      _id: null,
      content: this.form.value.feedback,
      createdBy: this.currentUserEmail,
      createdAt: this.formattedNow()
    };

    //zapisz feedback w bazie i wyslij email z potwierdzeniem
    this.feedbackService.addFeedback(userFeedback);
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
