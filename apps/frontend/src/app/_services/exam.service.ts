import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Examination } from '../_models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/api/exam/';

@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(private readonly http: HttpClient, private router: Router) {}

  getExams(
    examsPerPage: number,
    currentPage: number
  ): Observable<{ exams: Examination[]; count: number }> {
    let params = new HttpParams();
    params = params.append('pagesize', '' + examsPerPage);
    params = params.append('page', '' + currentPage);

    return this.http.get<{ exams: Examination[]; count: number }>(BACKEND_URL, {
      params
    });
  }

  getExam(id: string): Observable<Examination> {
    return this.http.get<Examination>(BACKEND_URL + id);
  }

  deleteExam(examId: string) {
    return this.http.delete(BACKEND_URL + examId);
  }
  //TODO zaktualizowac o pola badania
  addExam(exam: Examination) {
    this.http
      .post<{ message: string; exam: Examination }>(BACKEND_URL, exam)
      .subscribe(responseData => {
        this.router.navigate(['examinations']);
      });
  }

  updateExam(exam: Examination) {
    //TODO nawigacja
    this.http
      .put<{ message: string; exam: Examination }>(BACKEND_URL + exam._id, exam)
      .subscribe(responseData => {
        this.router.navigate(['examinations']);
      });
  }
}
