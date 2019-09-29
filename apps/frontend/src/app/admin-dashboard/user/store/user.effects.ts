import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.actions';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { User } from '../../../_models';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { Router } from '@angular/router';
import { of } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/api/user/';

@Injectable()
export class UserEffects {

  getUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.getUser),
    switchMap(props => {
      return this.http.get<User>(BACKEND_URL + props._id).pipe(
        map(user => {
          return UserActions.setUser({user});
        }),
        catchError(error => of(UserActions.errorUser({error})))
      )
    })
  ));

  addUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.addUser),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      return this.http.post<User>(BACKEND_URL, props.user).pipe(
        map(() => {
          this.router.navigate(['/admin/user/list']);
          return UserActions.fetchUsers({page: store.user.page});
        }),
        catchError(error => of(UserActions.errorUser({error})))
      )
    })
  ));

  updateUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.updateUser),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      return this.http.put<User>(BACKEND_URL+props.user._id, props.user).pipe(
        map(() => {
          this.router.navigate(['/admin/user/list']);
          return UserActions.fetchUsers({page: store.user.page});
        }),
        catchError(error => of(UserActions.errorUser({error})))
      );
    })
  ));

  fetchUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.fetchUsers),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      let params = new HttpParams();
      params = params.append('pagesize', ""+store.user.usersPerPage);
      params = params.append('page', ""+store.user.page);
      return this.http.get<{users: User[], count: number}>(BACKEND_URL,{ params }).pipe(
        map(res => UserActions.setUsers({users: res.users, count: res.count})),
        catchError(error => of(UserActions.errorUser({error})))
      )
    })
  ));

  deleteUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.deleteUser),
    switchMap(props => {
      return this.http.delete(BACKEND_URL + props._id).pipe(
        catchError(error => of(UserActions.errorUser({error})))
      )
    }),
    withLatestFrom(this.store),
    map(([props, store]) => {
      if (store.user.users.length === 1) {
        return UserActions.fetchUsers({page: store.user.page === 0 ? 0 : store.user.page - 1 });
      } else {
        return UserActions.fetchUsers({page: store.user.page});
      }
    })
  ));

  constructor(
    private readonly http: HttpClient,
    private readonly actions$: Actions,    
    private readonly router: Router,
    private readonly store: Store<AppState>){}
}