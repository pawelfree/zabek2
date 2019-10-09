import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { ExamListDataSource } from '../_datasource/exam-list.datasource';
import { DoctorExamService } from '../../_services';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from '../../common-dialogs/confirmation/confirmation.component';

@Component({
  selector: 'zabek-doctor-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class DoctorExamListComponent implements AfterViewInit, OnInit, OnDestroy {
  examsPerPage = 10;
  currentPage = 0;
  title = 'angular-confirmation-dialog';
  // order of columns on the view
  displayedColumns = [
    'examinationDate',
    'examinationType',
    'patientFullName',
    'patientPesel',
    'patientIsFemale',
    'patientAge',   
    'examinationFile',
    'actions'
  ];
  dataSource: ExamListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly doctorExamService: DoctorExamService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new ExamListDataSource(
      this.doctorExamService,
      this.examsPerPage
    );
    this.dataSource.loadExams(this.currentPage, this.examsPerPage);
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
    this.dataSource.loadExams(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
}
