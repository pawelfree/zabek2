import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/user/';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private readonly http: HttpClient) {}

  changePassword(authData: { _id: string, oldPassword: string, newPassword: string}) {
    return this.http.post(BACKEND_URL+'changepassword', authData);
  }

  me() {
    return this.http.get<User>(BACKEND_URL+'me');
  }

}
