import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable} from 'rxjs';
import { Doctor, User } from '@zabek/data';

export class DoctorListDataSource extends DataSource<User> {

  public doctors$: Observable<User[]>;

  constructor (private readonly data$: Observable<User[]>) {
    super();
    this.doctors$ = data$
  }

  connect(collectionViewer: CollectionViewer): Observable<readonly User[]> {
    return this.doctors$;
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}

}
