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

  getDoctors(doctorsPerPage: number = 10, currentPage: number = 0, options: {sort?: string, term?: string } = {}) {
    const params = new HttpParams()
      .set('pagesize', '' + doctorsPerPage)
      .set('page', '' + currentPage)
      .set('term', options?.term ? options.term : '')
      .set('sort', options?.sort ? options.sort : '');
    return this.http.get<{ doctors: Doctor[]; count: number }>(BACKEND_URL, {params});
  }

  getOnlineDoctors(doctorsPerPage: number = 10, currentPage: number = 0) {
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

  updateRegisteredDoctor(doctor: User) {
    return this.http.put<Doctor>(USER_BACKEND_URL + "updateregister/"+doctor._id, doctor);
  }

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(BACKEND_URL + id);
  }

  isEmailTaken(email: string, _id: string): Observable<boolean> {
    return this.http.get<boolean>(USER_BACKEND_URL + 'emailtaken/' + email);
  }

  isPwzTaken(pwz: string, _id: string): Observable<boolean> {
    const params = new HttpParams().set('doctor', '' + _id);
    return this.http.get<boolean>(BACKEND_URL + 'pwztaken/' + pwz, _id === null ? {} : {params});
  }
 
  isPeselTaken(pesel: string, _id: string): Observable<boolean> {
    const params = new HttpParams().set('doctor', '' + _id);
    return this.http.get<boolean>(BACKEND_URL + 'peseltaken/' + pesel, _id === null ? {} : {params});
  }

  isNipTaken(nip: string, _id: string): Observable<boolean> {
    const params = new HttpParams().set('doctor', '' + _id);
    return this.http.get<boolean>(BACKEND_URL + 'niptaken/' + nip, _id === null ? {} : {params});
  }
}
