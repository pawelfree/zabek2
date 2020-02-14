import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Examination } from '@zabek/data';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/api/doctor-exam/';

@Injectable({ providedIn: 'root' })
export class DoctorExamService {
  
  constructor(private readonly http: HttpClient, private router: Router) {}

  getExams(
    examsPerPage: number = 0,
    currentPage: number = 10
  ): Observable<{ exams: Examination[]; count: number }> {
    let params = new HttpParams();
    params = params.append('pagesize', '' + examsPerPage);
    params = params.append('page', '' + currentPage);

    return this.http.get<{ exams: Examination[]; count: number }>(BACKEND_URL, { params });
  }

  getExam(id: string): Observable<Examination> {
    return this.http.get<Examination>(BACKEND_URL + id);
  }

  setDownloadDate(id: string, date: string) {
    this.http.put(BACKEND_URL + id, {downloadDate : date}).subscribe().unsubscribe();
  }

}
