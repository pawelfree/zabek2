import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/email/';

@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor(private readonly http: HttpClient) {}

  sendNotificationToDoctor(examId: string) {
    let params = new HttpParams();
    params = params.append('examId', '' + examId);
    return this.http.get(BACKEND_URL, { params })
  }
}
