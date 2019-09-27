import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { LabListDataSource } from './lab-list.datasource';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as LabActions from '../store/lab.actions';

@Component({
  selector: 'zabek-lab-list',
  templateUrl: './lab-list.component.html',
  styleUrls: ['./lab-list.component.css']
})
export class LabListComponent implements AfterViewInit, OnInit, OnDestroy  {
  displayedColumns = ['name', 'email', 'address', 'actions'];
  dataSource: LabListDataSource;
  private paginatorSub: Subscription = null;
  private storeSub: Subscription = null;
  public isLoading = false;
  public count = 0; 
  public labsPerPage = 10;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('lab').subscribe(state => {
      this.isLoading = state.loading;
      this.count = state.count;
      this.labsPerPage = state.labsPerPage;
      if (this.paginator && this.paginator.pageIndex !==state.currentPage ) {
        this.paginator.pageIndex = state.currentPage;
      } 
    });

    this.dataSource = new LabListDataSource(this.store);   
    this.store.dispatch(LabActions.setCurrentPage({page: 0}))
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
            tap(() => this.store.dispatch(LabActions.setCurrentPage({page: this.paginator.pageIndex})))
        )
        .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
      this.storeSub = null;
    }
  }

  loadLabsPage() {
    this.store.dispatch(LabActions.setCurrentPage({page: this.paginator.pageIndex}));
  }

  onDelete(id: string) {
    this.store.dispatch(LabActions.deleteLab({id}));
  }

}
