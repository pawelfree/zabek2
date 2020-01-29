import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { ExamListDataSource } from './exam-list.datasource';
import { ExamService } from '../../_services';
import { tap, take, catchError } from 'rxjs/operators';
import { Subscription, of, BehaviorSubject } from 'rxjs';
import { ConfirmationComponent } from '../../common-dialogs/confirmation/confirmation.component';
import { Examination } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'zabek-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements AfterViewInit, OnInit, OnDestroy {
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

  constructor(private readonly examService: ExamService, 
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
    this.loadExams(
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
        // TODO: usuwac badanie powinien admin pracowni. Zrobić tylko adminowi, 
        // czy też może dwustopniowe usuwanie, pracownik zaznacza że do usunięcia,
        // a potem admin na swoim widoku widzi, i może usunąć fizycznie (z podaniem powodu).
        this.examService.deleteExam(id).subscribe(res => {
          if (this.itemsOnPage === 1) {
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
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '350px',
      data: 'Funkcjonalność w przygotowaniu.'
    });
  }

  loadExams(pageIndex = 0, pageSize = this.examsPerPage) {
    this.examService.getExams(pageSize, pageIndex) 
      .pipe(
        take(1),
        tap(result => {
          this.dataCount = result.count;
          this.exams.next(result.exams);
        }),        
        catchError(() => of<Examination[]>([])),
      )
      .subscribe();
  }

}
