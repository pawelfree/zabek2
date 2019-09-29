import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LabActions from './lab.actions';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Lab } from '../../../_models';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import { Router } from '@angular/router';
import { of } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Injectable()
export class LabEffects {

  getLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.getLab),
    switchMap(props => {
      return this.http.get<Lab>(BACKEND_URL + props.id).pipe(
        map(lab => {
          return LabActions.setLab({lab});
        }),
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  addLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.addLab),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      return this.http.post<Lab>(BACKEND_URL, props.lab).pipe(
        map(() => {
          this.router.navigate(['/admin/lab/list']);
          return LabActions.fetchLabs({page: store.lab.page});
        }),
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  updateLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.updateLab),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      return this.http.put<Lab>(BACKEND_URL+props.lab._id, props.lab).pipe(
        map(() => {
          this.router.navigate(['/admin/lab/list']);
          return LabActions.fetchLabs({page: store.lab.page});
        }),
        catchError(error => of(LabActions.errorLab({error})))
      );
    })
  ));

  fetchLabs = createEffect(() => this.actions$.pipe(
    ofType(LabActions.fetchLabs),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      let params = new HttpParams();
      params = params.append('pagesize', ""+store.lab.labsPerPage);
      params = params.append('page', ""+store.lab.page);
      return this.http.get<{labs: Lab[], count: number}>(BACKEND_URL,{ params }).pipe(
        map(res => LabActions.setLabs({labs: res.labs, count: res.count})),
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  deleteLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.deleteLab),
    switchMap(props => {
      return this.http.delete(BACKEND_URL + props.id).pipe(
        catchError(error => of(LabActions.errorLab({error})))
      )
    }),
    withLatestFrom(this.store),
    map(([props, store]) => {
      if (store.lab.labs.length === 1) {
        return LabActions.fetchLabs({page: store.lab.page === 0 ? 0 : store.lab.page - 1 });
      } else {
        return LabActions.fetchLabs({page: store.lab.page});
      }
    })
  ));

  constructor(
    private readonly http: HttpClient,
    private readonly actions$: Actions,    
    private readonly router: Router,
    private readonly store: Store<AppState>){}
}