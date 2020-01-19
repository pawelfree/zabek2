import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LabListDataSource } from './lab-list.datasource';
import { Observable, Subscription, from, noop } from 'rxjs';
import { LabEntityService } from '../services';
import { Lab } from '../../../_models';
import { map, tap, distinctUntilChanged, toArray, switchMap, withLatestFrom, skip, take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'zabek-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements OnInit, AfterViewInit, OnDestroy  {
  displayedColumns = ['name', 'email', 'address', 'actions'];
  dataSource: LabListDataSource;

  labs$: Observable<Lab[]>;
  isEmpty$: Observable<boolean>;
  totalCount$: Observable<number>;
  paging$: Observable<{page: number, pagesize: number}>;
  pagesize$: Observable<number>;
  paginatorSub: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readonly labEntityService: LabEntityService) {}

  ngOnInit() {
    this.labs$ = this.labEntityService.entities$.pipe(
      withLatestFrom(this.labEntityService.paging$),
      switchMap(([data, paging]) =>
        from(data).pipe(
          skip(paging.pagesize * paging.page),
          take(paging.pagesize),
          toArray()
        )
      )
    );

    this.isEmpty$ = this.labEntityService.count$.pipe(
      map(count => count === 0)
    );
    this.dataSource = new LabListDataSource(this.labs$);  
    this.totalCount$ = this.labEntityService.totalCount$.pipe(
      distinctUntilChanged()
    );
    this.paging$ = this.labEntityService.paging$.pipe(
      tap(paging => {
        if (this.paginator && this.paginator.pageIndex !== paging.page ) {
          this.paginator.pageIndex = paging.page;
        } 
      })
    );
    this.pagesize$ = this.paging$.pipe(
      map(data => data.pagesize)
    )

  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
             tap(() => this.labEntityService.getWithQuery({ page: this.paginator.pageIndex.toString()})))
        .subscribe();
  }

  onDelete(lab: Lab) {
    this.labEntityService.delete(lab);
  }

  reload() {
    this.labEntityService.getAll();
  }

}
