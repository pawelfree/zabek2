import { Injectable } from '@angular/core';
import { AppState, AppActions } from '../store';
import { Store } from '@ngrx/store';


@Injectable({ providedIn: 'root' })
export class LoadingService {

  constructor(private readonly store: Store<AppState>) {}

  setLoading() {
    this.store.dispatch(AppActions.loadingStart());
  }

  clearLoading() {
    this.store.dispatch(AppActions.loadingEnd());
  }

}
