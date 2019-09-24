import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { LabService } from '../../_services';
import { Lab } from '../../_models';
import { catchError, finalize, map } from 'rxjs/operators';

export class LabListDataSource extends DataSource<Lab> {

  private labsSubject = new BehaviorSubject<Lab[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public dataCount = 0; 
  public itemsOnPage = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor (
    private readonly labService: LabService, 
    private readonly pageSize
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Lab[] | readonly Lab[]> {
    return this.labsSubject.asObservable();
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {
    this.labsSubject.complete();
    this.loadingSubject.complete();
  }

  loadLabs(pageIndex = 0, pageSize = this.pageSize) {
    this.loadingSubject.next(true);
    this.labsSubject.subscribe();

    this.labService.getLabs(pageSize, pageIndex) 
      .pipe(
        catchError(() => of<{labs: Lab[], count: number}>({labs: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({labs, count}) => {
        this.itemsOnPage = labs.length;
        this.dataCount = count;
        this.labsSubject.next([...labs])
      });
  }
}
