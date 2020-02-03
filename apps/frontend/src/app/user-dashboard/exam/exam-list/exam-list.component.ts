import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { ExamListDataSource } from './exam-list.datasource';
import { ExamService } from '../../../_services';
import { tap, take, catchError } from 'rxjs/operators';
import { Subscription, of, BehaviorSubject } from 'rxjs';
import { ConfirmationComponent } from '../../../common-dialogs/confirmation/confirmation.component';
import { Examination, User } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';
import { FileUploadComponent } from '../../../files/fileupload/fileupload.component';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { currentUser } from '../../../auth/store';
import { environment } from '../../../../environments/environment';

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
    'actions'
  ];
  dataSource: ExamListDataSource;
  paginatorSub: Subscription = null;

  private user: User = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly examService: ExamService, 
              private readonly route: ActivatedRoute,
              private readonly store: Store<AppState>,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new ExamListDataSource(this.exams$);

    const data = this.route.snapshot.data.examinations;
    this.dataCount = data.count;
    this.itemsOnPage = data.exams.length
    this.exams.next(data.exams);

    this.store.pipe(select(currentUser),
      take(1),
      tap(user => {
        this.user = user;
      })
    ).subscribe();
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
    // TODO zrobic
    console.log(
      'Not implemented yet. Wyślij powiadomienie email do lekarza, o gotowości badania do pobrania.'
    );
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '350px',
      data: 'Funkcjonalność w przygotowaniu.'
    });
  }

  processFile(exam: Examination) {
    if (exam.file) {
      window.open(environment.s3BucketAddress+exam.file.key, "_blank");
    } else {
        const dialogRef =this.dialog.open(FileUploadComponent, {
        data: { exam, user: this.user},
        disableClose: true
      });
      dialogRef.afterClosed().pipe(
        take(1)
      ).subscribe(() => 
          this.loadExamsPage()
      );
    }
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
