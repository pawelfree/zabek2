import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private readonly http: HttpClient) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    return this.http.get<{ users: any; count: number }>(BACKEND_URL + queryParams);
  }

  getUser(id: string) {
    //TODO any
    return this.http.get<any>(BACKEND_URL + id);
  }

  deleteUser(userId: string) {
    return this.http.delete(BACKEND_URL + userId);
  }

  addUser(user : { role: string, password: string, email: string }) {
    return this.http.post(BACKEND_URL, user);
  }

  updateUser(user : { _id: string, role: string, password: string, email: string }) {
    return this.http.put(BACKEND_URL+user._id, user);
  }

  changePassword(authData: { _id: string, oldPassword: string, newPassword: string}) {
    return this.http.post(BACKEND_URL+'changepassword', authData);
  }

  me() {
    return this.http.get<User>(BACKEND_URL+'me');
  }
}
