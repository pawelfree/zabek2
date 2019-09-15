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

  loadExams(pageIndex = 1, pageSize = this.pageSize) {
    this.loadingSubject.next(true);
    this.examsSubject.subscribe();

    this.examService.getExams(pageSize, pageIndex) 
      .pipe(
        tap(x => console.log(x)),

        map(examsData => {
          return {
            exams: examsData.exams.map(exam => {
              return {
                patientFullName: exam.patientFullName,
                patientPesel: exam.patientPesel,
                patientAge: exam.patientAge,
                patientAck: exam.patientAck,
                doctorFullName : exam.doctorFullName,
                doctorQualificationsNo : exam.doctorQualificationsNo,
                sendEmailTo : exam.sendEmailTo,
                examinationDate : exam.examinationDate,
                examinationType : exam.examinationType,
                examinationFile : exam.examinationFile,
                id: exam.id
              };
            }),
            count: examsData.count
          };
        }),
        catchError(() => of<{exams: Examination[], count: number}>({exams: [], count: 0})),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({exams, count}) => {
        this.itemsOnPage = exams.length;
        this.dataCount = count;
        this.examsSubject.next([...exams])
      });
  }
}
