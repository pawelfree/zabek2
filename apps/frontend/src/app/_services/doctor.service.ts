import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Doctor } from '../_models';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/doctor/';

@Injectable({ providedIn: 'root' })
export class DoctorService {

  constructor(private readonly http: HttpClient) {}

  addDoctor(doctor:  Doctor) {
    return this.http.post(BACKEND_URL, doctor);
  }

  activate(userId: string) {
    return this.http.put(BACKEND_URL+"activate/"+userId, {});
  }

}
