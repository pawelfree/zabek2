import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { User } from '../../../_models';
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';

export class UserListDataSource extends DataSource<User> {

  constructor ( private readonly store: Store<AppState>) { super(); }

  connect(collectionViewer: CollectionViewer): Observable<readonly User[]> {
    return this.store.select('user').pipe(switchMap(state => of(state.users)));
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}
}
