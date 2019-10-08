import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { ExamListDataSource } from '../_datasource/exam-list.datasource';
import { ExamService } from '../../_services';
import { tap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfirmationComponent } from '../../common-dialogs/confirmation/confirmation.component';

@Component({
  selector: 'zabek-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements AfterViewInit, OnInit, OnDestroy {
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
    'patientProcessingAck',
    'doctorFullName',
    'doctorQualificationsNo',
    'sendEmailTo',
    'examinationFile',
    'actions'
  ];
  dataSource: ExamListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly examService: ExamService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new ExamListDataSource(
      this.examService,
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

  onDelete(id) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '350px',
      data: 'Czy na pewno chcesz usunąć badanie?'
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        console.log('Yes clicked'); 
        // TODO: usuwac badanie powinien admin pracowni. Zrobić tylko adminowi, 
        // czy też może dwustopniowe usuwanie, pracownik zaznacza że do usunięcia,
        // a potem admin na swoim widoku widzi, i może usunąć fizycznie (z podaniem powodu).
        this.examService.deleteExam(id).subscribe(res => {
          if (this.dataSource.itemsOnPage === 1) {
            this.paginator.pageIndex = this.paginator.pageIndex - 1;
          }
          this.loadExamsPage();
        });
      }
    });
  }

  onSendNotificationToDoctor(id) {
    // TODO
    console.log(
      'Not implemented yet. Wyślij powiadomienie email do lekarza, o gotowości badania do pobrania.'
    );
  }
}
