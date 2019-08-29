import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Lab } from '../_models';
import { Observable } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Injectable({ providedIn: 'root' })
export class LabService {

  constructor(private readonly http: HttpClient) {}

  getLabs(labsPerPage: number, currentPage: number): Observable<{labs: Lab[], count: number}> {
    const queryParams = `?pagesize=${labsPerPage}&page=${currentPage}`;
    return this.http.get<{labs: Lab[], count: number}>(BACKEND_URL + queryParams);
  }

  getLab(id: string): Observable<Object> {
    return this.http.get(BACKEND_URL + id);
  }

  deleteLab(labId: string) {
    return this.http.delete(BACKEND_URL + labId);
  }
}