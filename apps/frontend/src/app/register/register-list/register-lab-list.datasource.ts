import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Lab } from '@zabek/data';

export class RegisterLabListDataSource extends DataSource<Lab> {

  constructor (private readonly labs: Observable<Lab[]>) { super(); }

  connect(collectionViewer: CollectionViewer): Observable<Lab[] | readonly Lab[]> {
    return this.labs;
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {}

}
