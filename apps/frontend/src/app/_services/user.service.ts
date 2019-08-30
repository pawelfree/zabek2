import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/user/';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];
  private usersUpdated = new Subject<{ users: User[]; userCount: number }>();

  constructor(private readonly http: HttpClient) {}

  getUsers(usersPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    return this.http.get<{ users: any; count: number }>(BACKEND_URL + queryParams);
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUser(id: string) {
    //TODO any
    return this.http.get<any>(BACKEND_URL + id);
  }

  deleteUser(userId: string) {
    return this.http.delete(BACKEND_URL + userId);
  }
}
