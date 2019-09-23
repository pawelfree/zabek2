import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DoctorService } from '../../_services';
import { Doctor } from '../../_models';
import { catchError, finalize } from 'rxjs/operators';

export class DoctorListDataSource extends DataSource<Doctor> {

  private doctorSubject = new BehaviorSubject<Doctor[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public dataCount = 0; 
  public itemsOnPage = 0;
  public loading$ = this.loadingSubject.asObservable();

  constructor (
    private readonly doctorService: DoctorService, 
    private readonly pageSize
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<readonly Doctor[]> {
    return this.doctorSubject.asObservable();
  }  
  
  disconnect(collectionViewer: CollectionViewer): void {
    this.doctorSubject.complete();
    this.loadingSubject.complete();
  }

  loadDoctors(pageIndex = 1, pageSize = this.pageSize) {
    this.loadingSubject.next(true);
    this.doctorSubject.subscribe();

    this.doctorService.getDoctors(pageSize, pageIndex) 
      .pipe(
        catchError(() => of<{doctors: Doctor[], count: number}>({doctors: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({doctors, count}) => {
        this.itemsOnPage = doctors.length;
        this.dataCount = count;
        this.doctorSubject.next([...doctors])
      });
  }
}
