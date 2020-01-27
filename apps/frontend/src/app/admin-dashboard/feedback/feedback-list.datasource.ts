import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { Feedback } from '../../_models';

export class FeedbackListDataSource extends DataSource<Feedback> {

  public feedbacks$: Observable<Feedback[]>;

  constructor (private readonly data$: Observable<Feedback[]>) {
    super();
    this.feedbacks$ = data$
  }

  connect(collectionViewer: CollectionViewer): Observable<Feedback[] | readonly Feedback[]> {
    return this.feedbacks$;
  }  
  
  disconnect(collectionViewer: CollectionViewer): void { }
  
}
