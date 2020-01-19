import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Lab } from '../../../_models';

export class LabListDataSource extends DataSource<Lab> {

  constructor ( private readonly labs$: Observable<Lab[]>) { 
    super(); 
  }

  connect(collectionViewer: CollectionViewer): Observable<Lab[] | readonly Lab[]> {
    return this.labs$;
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}

}
