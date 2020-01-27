import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable} from 'rxjs';
import { Doctor } from '../../_models';

export class DoctorListDataSource extends DataSource<Doctor> {

  public doctors$: Observable<Doctor[]>;

  constructor (private readonly data$: Observable<Doctor[]>) {
    super();
    this.doctors$ = data$
  }

  connect(collectionViewer: CollectionViewer): Observable<readonly Doctor[]> {
    return this.doctors$;
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}

}
