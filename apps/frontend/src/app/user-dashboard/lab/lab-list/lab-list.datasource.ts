import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { Lab } from '@zabek/data';
import { switchMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { selectLabState } from '../../store';
import { AppState } from '../../../store';

export class LabListDataSource extends DataSource<Lab> {

  constructor ( private readonly store: Store<AppState>) { super(); }

  connect(collectionViewer: CollectionViewer): Observable<Lab[] | readonly Lab[]> {
    return this.store.pipe(select(selectLabState)).pipe(switchMap(state => of(state.labs)));
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}

}
