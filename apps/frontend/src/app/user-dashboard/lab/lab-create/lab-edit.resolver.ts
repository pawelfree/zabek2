import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Lab } from '@zabek/data';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { take, map, catchError } from 'rxjs/operators';
import { LabActions } from '../store';
import { Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

@Injectable({ 
   providedIn: 'root'
}) 
export class LabEditResolver implements Resolve<Lab> { 

   constructor(
      private readonly store: Store<AppState>,
      private readonly actions$: Actions) { } 

   resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {      
      if (route.paramMap.has('labId')) {
         const _id = route.paramMap.get('labId');         
         this.store.dispatch(LabActions.getLab({_id}));
         return this.actions$.pipe(
            ofType(LabActions.setLab),
            take(1),
            map(props => props.lab),
            catchError(error => of(null))
         )
      } else {
         return null;
      } 
   }
}
