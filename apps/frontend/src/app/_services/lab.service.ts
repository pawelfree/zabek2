import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Lab } from '../_models';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Injectable({ providedIn: 'root' })
export class LabService {

  constructor(private readonly http: HttpClient) {}

  getLab(id: string): Observable<Lab> {
    return this.http.get<Lab>(BACKEND_URL + id);
  }

  addLab(lab : { name: string, address: string, email: string }) {
    return this.http.post<{ message: string; post: Lab }>(BACKEND_URL, lab);
  }

  updateLab(lab : { _id: string, name: string, address: string, email: string }) {
    return this.http.put<{ message: string; post: Lab }>(BACKEND_URL+lab._id, lab);
  }
}