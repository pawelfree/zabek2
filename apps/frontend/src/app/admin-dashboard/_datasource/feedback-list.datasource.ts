import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { FeedbackService } from '../../_services';
import { Feedback } from '../../_models';
import { catchError, finalize, map , tap} from 'rxjs/operators';

export class FeedbackListDataSource extends DataSource<Feedback> {

  private feedbacksSubject = new BehaviorSubject<Feedback[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public dataCount = 0; 
  public itemsOnPage = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor (
    private readonly feedbackService: FeedbackService, 
    private readonly pageSize
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Feedback[] | readonly Feedback[]> {
    return this.feedbacksSubject.asObservable();
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {
    this.feedbacksSubject.complete();
    this.loadingSubject.complete();
  }

  loadFeedbacks(pageIndex = 0, pageSize = this.pageSize) {
    this.loadingSubject.next(true);
    this.feedbacksSubject.subscribe();

    this.feedbackService.getFeedbacks(pageSize, pageIndex) 
      .pipe(
        catchError(() => of<{feedbacks: Feedback[], count: number}>({feedbacks: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({feedbacks, count}) => {
        this.itemsOnPage = feedbacks.length;
        this.dataCount = count;
        this.feedbacksSubject.next([...feedbacks])
      });
  }
  
}
