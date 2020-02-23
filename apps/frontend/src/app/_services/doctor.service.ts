import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  addUser(doctor: User) {
    return this.http.post<User>(USER_BACKEND_URL,doctor);
  }

  registerDoctor(doctor: User) {
    return this.http.post<User>(USER_BACKEND_URL + 'register', doctor);
  }

  updateUser(doctor: User) {
    return this.http.put<User>(USER_BACKEND_URL + doctor._id, doctor)
  }

  getOnlineDoctor(id: string) {
    return this.http.get<User>(USER_BACKEND_URL + id);
  }

  updateRegisteredDoctor(doctor: User, token: string) {
    const params = new HttpParams().set('token', token);
    return this.http.put<Doctor>(USER_BACKEND_URL + "updateregister/"+doctor._id, doctor, {params});
  }

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(BACKEND_URL + id);
  }

  isEmailTaken(email: string, _id: string): Observable<boolean> {
    const params = new HttpParams().set('user', '' + _id);
    return this.http.get<boolean>(USER_BACKEND_URL + 'emailtaken/' + email, _id === null ? {} : {params} );
  }

  isPwzTaken(pwz: string, _id: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('doctor', '' + _id);
    return this.http.get<boolean>(BACKEND_URL + 'pwztaken/' + pwz, _id === null ? {} : {params});
  }
 
  isPeselTaken(pesel: string, _id: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('doctor', '' + _id);
    return this.http.get<boolean>(BACKEND_URL + 'peseltaken/' + pesel, _id === null ? {} : {params});
  }

  isNipTaken(nip: string, _id: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('doctor', '' + _id);
    return this.http.get<boolean>(BACKEND_URL + 'niptaken/' + nip, _id === null ? {} : {params});
  }
}
