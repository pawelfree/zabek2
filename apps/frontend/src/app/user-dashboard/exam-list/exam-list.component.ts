import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { ExamListDataSource } from '../_datasource/exam-list.datasource';
import { ExamService } from '../../_services';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements AfterViewInit, OnInit, OnDestroy  {
  examsPerPage = 10;
  currentPage = 0;
  // order of columns on the view
  displayedColumns = ['examinationDate', 
                      'examinationType',                     
                      'patientFullName',
                      'patientPesel', 
                      'patientAge', 
                      'patientAck',
                      'doctorFullName',
                      'doctorQualificationsNo',
                      'sendEmailTo',
                      'examinationFile',
                      'actions']; 
  dataSource: ExamListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly examService: ExamService,
  ) {}

  ngOnInit() {
    this.dataSource = new ExamListDataSource(this.examService, this.examsPerPage);   
    this.dataSource.loadExams(this.currentPage, this.examsPerPage);
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
            tap(() => this.loadExamsPage())
        )
        .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
  }

  loadExamsPage() {
      this.dataSource.loadExams( this.paginator.pageIndex, this.paginator.pageSize);
  }

  onDelete(id) {
    this.examService.deleteExam(id)
      .subscribe(res => {
        if (this.dataSource.itemsOnPage === 1 ) {
          this.paginator.pageIndex = this.paginator.pageIndex - 1;
        }
        this.loadExamsPage();
      }
    );
  }

}
