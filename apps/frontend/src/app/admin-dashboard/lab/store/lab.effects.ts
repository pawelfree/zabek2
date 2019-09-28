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
        //TODO obsluzyc na froncie i baku
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  addLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.addLab),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      return this.http.post<{lab: Lab }>(BACKEND_URL, store.lab.lab).pipe(
        map(() => {
          //TODO nawigacja nie dziala
          this.router.navigate(['../list']);
          return LabActions.fetchLabs();
        }),
        catchError(error => {
          return of(LabActions.errorLab({error}));
        })
      )
    })
  ));

  updateLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.updateLab),
    switchMap(props => {
      //TODO message jest raczej pusty
      return this.http.put<{ message: string; lab: Lab }>(BACKEND_URL+props.lab._id, props.lab).pipe(
        map(() => {
          //TODO nawigacja nie dziala
          this.router.navigate(['../list']);
          return LabActions.fetchLabs();
        }),
        catchError(error => {
          return of(LabActions.errorLab({error}));
        })
      );
    })
  ));

  fetchLabs = createEffect(() => this.actions$.pipe(
    ofType(LabActions.fetchLabs),
    withLatestFrom(this.store),
    switchMap(([props, store]) => {
      let params = new HttpParams();
      params = params.append('pagesize', ""+store.lab.labsPerPage);
      params = params.append('page', ""+store.lab.currentPage);
      //TODO to zwrocie blad i wywali aplikacje
      return this.http.get<{labs: Lab[], count: number}>(BACKEND_URL,{ params });
    }),
    map(res => LabActions.setLabs({labs: res.labs, count: res.count}))
  ));

  deleteLab = createEffect(() => this.actions$.pipe(
    ofType(LabActions.deleteLab),
    switchMap(props => {
      //TODO zwroci blad i wywali aplikacje
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
    private readonly router: Router,
    private readonly store: Store<AppState>){}
}