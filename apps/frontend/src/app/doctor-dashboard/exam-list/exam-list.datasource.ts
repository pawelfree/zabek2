import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Examination } from '../../_models';

export class ExamListDataSource extends DataSource<Examination> {
  
    public examinations$: Observable<Examination[]>;
  
    constructor (private readonly data$: Observable<Examination[]>) {
      super();
      this.examinations$ = data$
    }
  
    connect(collectionViewer: CollectionViewer): Observable<Examination[] | readonly Examination[]> {
      return this.examinations$;
    }  
    
    disconnect(collectionViewer: CollectionViewer): void {}
    
  }
  