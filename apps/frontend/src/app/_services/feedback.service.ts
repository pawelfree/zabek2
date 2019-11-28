import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/api/feedback/';

@Injectable({ providedIn: 'root' })
export class FeedbackService {

  constructor(private readonly http: HttpClient,private router: Router) {}

  sendFeedbackToLabEmail(feedback: string) {
    return this.http.put(BACKEND_URL+"send/"+ feedback, {});
  }  
}
