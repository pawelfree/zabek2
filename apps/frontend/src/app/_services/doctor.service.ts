import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Doctor, User } from '@zabek/data';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/api/doctor/';
const USER_BACKEND_URL = environment.apiUrl + '/api/user/';

@Injectable({ providedIn: 'root' })
export class DoctorService {

  constructor(private readonly http: HttpClient) {}

  addDoctor(doctor:  Doctor) {
    return this.http.post(BACKEND_URL, doctor);
  }
  
  updateDoctor(doctor:  Doctor) {
    return this.http.put<{ message: string; doctor: Doctor }>(BACKEND_URL + doctor._id, doctor);
  }

  activate(userId: string) {
    return this.http.put(BACKEND_URL+"activate/"+userId, {});
  }

  acceptRules(userId: string) {
    return this.http.put(BACKEND_URL+"acceptrules/"+userId, {});
  }

  getDoctors(doctorsPerPage: number = 0, currentPage: number = 10) {
    const queryParams = `?pagesize=${doctorsPerPage}&page=${currentPage}`;
    return this.http.get<{ doctors: Doctor[]; count: number }>(BACKEND_URL + queryParams);
  }

  getOnlineDoctors(doctorsPerPage: number = 0, currentPage: number = 10) {
    const queryParams = `?pagesize=${doctorsPerPage}&page=${currentPage}`;
    return this.http.get<{ doctors: User[]; count: number }>(BACKEND_URL + 'online/' + queryParams);
  }

  getOnlineDoctor(id: string) {
    return this.http.get<User>(USER_BACKEND_URL + id);
  }

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(BACKEND_URL + id);
  }
 
}
