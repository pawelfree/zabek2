import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { User } from '../../../_models';
import { switchMap, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { UserState } from '../store/user.reducer';
import { selectUserState } from '../store';

export class UserListDataSource extends DataSource<User> {

  constructor ( private readonly store: Store<UserState>) { super(); }

  connect(collectionViewer: CollectionViewer): Observable<readonly User[]> {
    return this.store.pipe(
      select(selectUserState),
      switchMap(state => of(state.users)));
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}
}
