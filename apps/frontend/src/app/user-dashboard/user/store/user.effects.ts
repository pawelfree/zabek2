import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserActions } from '../store';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { User } from '@zabek/data';
import { environment } from '../../../../environments/environment';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserState } from './user.reducer';
import { selectUserState } from './user.selectors';

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
    withLatestFrom(this.store.pipe(select(selectUserState))),
    switchMap(([props, store]) => {
      return this.http.post<User>(BACKEND_URL, props.user).pipe(
        map(() => {
          this.router.navigate(['/admin/user/list']);
          return UserActions.fetchUsers({page: store.page});
        }),
        catchError(error => of(UserActions.errorUser({error})))
      )
    })
  ));

  updateUser$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.updateUser),
    withLatestFrom(this.store.pipe(select(selectUserState))),
    switchMap(([props, store]) => {
      return this.http.put<User>(BACKEND_URL+props.user._id, props.user).pipe(
        map(() => {
          this.router.navigate(['/admin/user/list']);
          return UserActions.fetchUsers({page: store.page});
        }),
        catchError(error => of(UserActions.errorUser({error})))
      );
    })
  ));

  fetchUsers$ = createEffect(() => this.actions$.pipe(
    ofType(UserActions.fetchUsers),
    withLatestFrom(this.store.pipe(select(selectUserState))),
    switchMap(([props, store]) => {
      let params = new HttpParams();
      params = params.append('pagesize', ""+store.usersPerPage);
      params = params.append('page', ""+store.page);
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
    withLatestFrom(this.store.pipe(select(selectUserState))),
    map(([props, store]) => {
      if (store.users.length === 1) {
        return UserActions.fetchUsers({page: store.page === 0 ? 0 : store.page - 1 });
      } else {
        return UserActions.fetchUsers({page: store.page});
      }
    })
  ));

  constructor(
    private readonly http: HttpClient,
    private readonly actions$: Actions,    
    private readonly router: Router,
    private readonly store: Store<UserState>){}
}