import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LabActions }  from '.';
import { map, switchMap, withLatestFrom, catchError, tap } from 'rxjs/operators';
import { Lab } from '@zabek/data';
import { environment } from '../../../environments/environment';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { selectLabState } from '.';
import { LoadingService } from '../../_services';
import { AppState } from '../../store';


const BACKEND_URL = environment.apiUrl + '/api/lab/';

@Injectable()
export class LabEffects {

  getLab$ = createEffect(() => this.actions$.pipe(
    ofType(LabActions.getLab),
    switchMap(props => {
      return this.http.get<Lab>(BACKEND_URL + props._id).pipe(
        map(lab => {
          return LabActions.setLab({lab});
        }),
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  addLab$ = createEffect(() => this.actions$.pipe(
    ofType(LabActions.addLab),
    withLatestFrom(this.store.pipe(select(selectLabState))),
    switchMap(([props, store]) => {
      return this.http.post<Lab>(BACKEND_URL, props.lab).pipe(
        map(() => {
          this.loading.clearLoading();
          this.router.navigate(['/user/lab/list']);
          return LabActions.fetchLabs({page: store.page});
        }),
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  updateLab$ = createEffect(() => this.actions$.pipe(
    ofType(LabActions.updateLab),
    withLatestFrom(this.store.pipe(select(selectLabState))),
    switchMap(([props, store]) => {
      return this.http.put<Lab>(BACKEND_URL+props.lab._id, props.lab).pipe(
        map(() => {
          this.loading.clearLoading();
          this.router.navigate(['/user/lab/list']);
          return LabActions.fetchLabs({page: store.page});
        }),
        catchError(error => of(LabActions.errorLab({error})))
      );
    })
  ));

  fetchLabs$ = createEffect(() => this.actions$.pipe(
    ofType(LabActions.fetchLabs),
    withLatestFrom(this.store.pipe(select(selectLabState))),
    switchMap(([props, store]) => {
      let params = new HttpParams();
      params = params.append('pagesize', ""+store.labsPerPage);
      params = params.append('page', ""+store.page);
      return this.http.get<{labs: Lab[], count: number}>(BACKEND_URL,{ params }).pipe(
        map(res => LabActions.setLabs({labs: res.labs, count: res.count})),
        catchError(error => of(LabActions.errorLab({error})))
      )
    })
  ));

  deleteLab$ = createEffect(() => this.actions$.pipe(
    ofType(LabActions.deleteLab),
    switchMap(props => {
      return this.http.delete(BACKEND_URL + props._id).pipe(
        catchError(error => of(LabActions.errorLab({error})))
      )
    }),
    withLatestFrom(this.store.pipe(select(selectLabState))),
    map(([props, store]) => {
      if (store.labs.length === 1) {
        return LabActions.fetchLabs({page: store.page === 0 ? 0 : store.page - 1 });
      } else {
        return LabActions.fetchLabs({page: store.page});
      }
    })
  ));

  constructor(
    private readonly http: HttpClient,
    private readonly actions$: Actions,    
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly loading: LoadingService){}
}