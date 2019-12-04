import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FeedbackListDataSource } from '../../_datasource/feedback-list.datasource';
import { FeedbackService } from '../../../_services';

@Component({
  selector: 'zabek-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements AfterViewInit, OnInit, OnDestroy {
  feedbacksPerPage = 10;
  currentPage = 0;

  // order of columns on the view
  displayedColumns = [
    'createdAt',
    'createdBy',
    'content',
    'lab',
    'actions'
  ];
  dataSource: FeedbackListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly feedbackService: FeedbackService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new FeedbackListDataSource(
      this.feedbackService,
      this.feedbacksPerPage
    );
    this.dataSource.loadFeedbacks(this.currentPage, this.feedbacksPerPage);
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
      .pipe(tap(() => this.loadFeedbacksPage()))
      .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
  }

  loadFeedbacksPage() {
    this.dataSource.loadFeedbacks(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }


}
