import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ExamListDataSource } from './exam-list.datasource';
import { DoctorExamService } from '../../_services';
import { tap, take, catchError } from 'rxjs/operators';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { Examination } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, AppActions } from '../../store';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'zabek-doctor-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class DoctorExamListComponent implements AfterViewInit, OnInit, OnDestroy {
  examsPerPage = 10;
  currentPage = 0;
  dataCount = 0;
  itemsOnPage
  
  private exams = new BehaviorSubject<Examination[]>([]);
  private exams$ = this.exams.asObservable();
  
  title = 'angular-confirmation-dialog';
  // order of columns on the view
  displayedColumns = [
    'examinationDate',
    'examinationType',
    'patientFullName',
    'patientPesel',
    'patientIsFemale',
    'patientAge',  
    'actions'
  ];
  dataSource: ExamListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly doctorExamService: DoctorExamService,
              private readonly route: ActivatedRoute,
              private readonly store: Store<AppState>) {}

  ngOnInit() {
    this.dataSource = new ExamListDataSource(this.exams$);

    const data = this.route.snapshot.data.examinations;
    this.dataCount = data.count;
    this.itemsOnPage = data.exams.length
    this.exams.next(data.exams);
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
      .pipe(tap(() => this.loadExamsPage()))
      .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
  }

  loadExamsPage() {
    this.loadExams( this.paginator.pageIndex, this.paginator.pageSize);
  }

  loadExams(pageIndex = 0, pageSize = this.examsPerPage) {
    return this.doctorExamService.getExams(pageSize, pageIndex) 
      .pipe(
        take(1),
        tap(result => {
          this.dataCount = result.count;
          this.exams.next(result.exams);
        }),
        catchError(() => of<Examination[]>([])),
      ).subscribe();
  }

  processFile(exam: Examination) {
    if (exam.file) {
      window.open(environment.s3BucketAddress+exam.file.key, "_blank");
    } else 
    {
      this.store.dispatch(AppActions.raiseError({message: 'Do badania nie załączono pliku', status: 'To nie powinno się zdarzyć'}));
    }
  }

}
