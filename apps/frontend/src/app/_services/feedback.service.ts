import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Feedback } from '../_models';
import { Observable } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/api/feedback/';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private readonly http: HttpClient, private router: Router) {}

  addFeedback(feedback: Feedback) {
    this.http
      .post<{ message: string; feedback: Feedback }>(BACKEND_URL, feedback)
      .subscribe(responseData => {
        this.router.navigate(['/']); //TODO czy przekierować na jakąś stronęz informacją o poprawnym zapisaniu feedbacku?
      });
  }

  getFeedbacks(
    feedbacksPerPage: number = 0,
    currentPage: number = 10
  ): Observable<{ feedbacks: Feedback[]; count: number }> {
    let params = new HttpParams();
    params = params.append('pagesize', '' + feedbacksPerPage); //TODO refactor - to powinno byc wszedzie itemsPerPage
    params = params.append('page', '' + currentPage);

    return this.http.get<{ feedbacks: Feedback[]; count: number }>(BACKEND_URL, { params });
  }

}
