import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '@zabek/data';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Actions, ofType } from '@ngrx/effects';
import { UserActions } from '../store';
import { take, map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' }) 
export class UserListResolver implements Resolve<User[]> {

  constructor(
    private readonly store: Store<AppState>,
    private readonly actions$: Actions) { } 
  
  //TODO remember - niczego nie musi zwracac, zapewnia ze nie ma przejscia dopuki nie zaladuja sie dane
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {
    this.store.dispatch(UserActions.fetchUsers({page: 0}));
    return this.actions$.pipe(
      ofType(UserActions.setUsers),
      take(1),
      map(props => props.users),
      catchError(error => of(null))
    )
  }

}