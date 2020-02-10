import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { tap, take, catchError } from 'rxjs/operators';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { FeedbackListDataSource } from '../feedback-list.datasource';
import { FeedbackService } from '../../../_services';
import { Feedback } from '@zabek/data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'zabek-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.css']
})
export class FeedbackListComponent implements AfterViewInit, OnInit, OnDestroy {
  feedbacksPerPage = 10;
  currentPage = 0;
  dataCount = 0; 
  itemsOnPage = 0;

  // order of columns on the view
  displayedColumns = [
    'createdAt',
    'createdBy',
    'content',
    'lab',
    'actions'
  ];

  private feedbacks = new BehaviorSubject<Feedback[]>([]);
  private feedbacks$ = this.feedbacks.asObservable();
  
  dataSource: FeedbackListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private readonly feedbackService: FeedbackService,
              private readonly route: ActivatedRoute,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new FeedbackListDataSource(this.feedbacks$);

    const data = this.route.snapshot.data.feedbacks;
    this.dataCount = data.count;
    this.feedbacks.next(data.feedbacks);
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
    this.loadFeedbacks(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  loadFeedbacks(pageIndex = 0, pageSize = this.feedbacksPerPage) {
    return this.feedbackService.getFeedbacks(pageSize, pageIndex) 
      .pipe(
        take(1),
        tap(result => {
          this.dataCount = result.count;
          this.feedbacks.next(result.feedbacks)
        }),
        catchError(() => of<Feedback[]>([]))
      ).subscribe();
  }

}
