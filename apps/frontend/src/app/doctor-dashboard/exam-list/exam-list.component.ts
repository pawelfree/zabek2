import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { ExamListDataSource } from './exam-list.datasource';
import { DoctorExamService } from '../../_services';
import { tap, take, catchError } from 'rxjs/operators';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { Examination } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';

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
              public dialog: MatDialog) {}

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

}
