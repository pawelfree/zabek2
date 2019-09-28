import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { Lab } from '../../../_models';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as LabActions from '../store/lab.actions';

export class LabListDataSource extends DataSource<Lab> {

  constructor ( private readonly store: Store<AppState>) { super(); }

  connect(collectionViewer: CollectionViewer): Observable<Lab[] | readonly Lab[]> {
    return this.store.select('lab').pipe(switchMap(state => of(state.labs)));
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}

  loadLabs() {
    this.store.dispatch(LabActions.fetchLabs())
  }
}
