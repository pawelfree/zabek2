import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { LabService } from '../../_services';
import { Lab } from '../../_models';
import { catchError, finalize, map } from 'rxjs/operators';

export class LabListDataSource extends DataSource<Lab> {

  private labsSubject = new BehaviorSubject<Lab[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public dataCount = 0; 
  public loading$ = this.loadingSubject.asObservable();

  constructor (
    private readonly labService: LabService
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

  loadLabs(pageIndex = 0, pageSize = 3) {
    this.loadingSubject.next(true);
    this.labsSubject.subscribe();

    this.labService.getLabs(pageSize, pageIndex) 
      .pipe(
        map(labsData => {
          return {
            labs: labsData.labs.map(lab => {
              return {
                name: lab.name,
                email: lab.email,
                address: lab.address,
                _id: lab._id
              };
            }),
            count: labsData.count
          };
        }),
        catchError(() => of<{labs: Lab[], count: number}>({labs: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({labs, count}) => {
        this.dataCount = count;
        this.labsSubject.next([...labs])
      });
  }
}
