import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ExamService } from '../../_services';
import { Examination } from '../../_models';
import { catchError, finalize, map , tap} from 'rxjs/operators';

export class ExamListDataSource extends DataSource<Examination> {

  private examsSubject = new BehaviorSubject<Examination[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public dataCount = 0; 
  public itemsOnPage = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor (
    private readonly examService: ExamService, 
    private readonly pageSize
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Examination[] | readonly Examination[]> {
    return this.examsSubject.asObservable();
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {
    this.examsSubject.complete();
    this.loadingSubject.complete();
  }

  loadExams(pageIndex = 0, pageSize = this.pageSize) {
    this.loadingSubject.next(true);
    this.examsSubject.subscribe();

    this.examService.getExams(pageSize, pageIndex) 
      .pipe(
        catchError(() => of<{exams: Examination[], count: number}>({exams: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({exams, count}) => {
        console.log(exams[0])
        this.itemsOnPage = exams.length;
        this.dataCount = count;
        this.examsSubject.next([...exams])
      });
  }
  
}
