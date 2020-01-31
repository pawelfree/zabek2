import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '@zabek/data';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { take, map, catchError } from 'rxjs/operators';
import * as UserActions from '../../store/user.actions';
import { Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

@Injectable({ 
   providedIn: 'root'
}) 
export class UserEditResolver implements Resolve<User> { 

   constructor(
      private readonly store: Store<AppState>,
      private readonly actions$: Actions) { } 

   resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {      
      if (route.paramMap.has('userId')) {
         const _id = route.paramMap.get('userId');         
         this.store.dispatch(UserActions.getUser({_id}));
         return this.actions$.pipe(
            ofType(UserActions.setUser),
            take(1),
            map(props => props.user),
            catchError(error => of(null))
         )
      } else {
         return null;
      } 
   }
}
