import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LabActions from './lab.actions';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Lab } from '../../../_models';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';

const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Injectable()
export class LabEffects {

  fetchLabs = createEffect(() => this.actions$.pipe(
    ofType(LabActions.fetchLabs),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      let params = new HttpParams();
      params = params.append('pagesize', ""+store.lab.labsPerPage);
      params = params.append('page', ""+store.lab.currentPage);
  
      return this.http.get<{labs: Lab[], count: number}>(BACKEND_URL,{ params });
    }),
    map(res => LabActions.setLabs({labs: res.labs, count: res.count}))
  ));

  deleteLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.deleteLab),
    switchMap(props => {
      return this.http.delete(BACKEND_URL + props.id);
    }),
    withLatestFrom(this.store),
    map(([props, store]) => {
      if (store.lab.labs.length === 1) {
        return LabActions.setCurrentPage({page: store.lab.currentPage === 0 ? 0 : store.lab.currentPage - 1 });
      } else {
        return LabActions.fetchLabs();
      }
    })
  ));

  setCurrentPage = createEffect(() => this.actions$.pipe(
    ofType(LabActions.setCurrentPage),
    map(() => LabActions.fetchLabs())
  ));

  constructor(
    private readonly http: HttpClient,
    private readonly actions$: Actions,
    private readonly store: Store<AppState>){}
}