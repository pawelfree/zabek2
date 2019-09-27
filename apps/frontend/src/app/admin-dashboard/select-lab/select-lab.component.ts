import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { LabService } from '../../_services';
import { MatPaginator, MatDialogRef } from '@angular/material';
import { tap } from 'rxjs/operators';
import { LabListDataSource } from '../lab/lab-list/lab-list.datasource';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import * as LabActions from '../lab/store/lab.actions';

@Component({
  templateUrl: './select-lab.component.html',
  styleUrls: ['./select-lab.component.css']
})
export class SelectLabComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'address'];
  dataSource: LabListDataSource;
  private paginatorSub: Subscription = null;
  private storeSub: Subscription = null;
  public isLoading = false;
  public count = 0; 
  public labsPerPage = 10;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor (
    private readonly dialogRef: MatDialogRef<SelectLabComponent>, 
    private readonly store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(LabActions.setLabsPerPage({labsPerPage: 5}));

    this.storeSub = this.store.select('lab').subscribe(state => {
      this.isLoading = state.loading;
      this.count = state.count;
      this.labsPerPage = state.labsPerPage;
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

  onRowClicked(row){
    this.dialogRef.close(row)
  }

}
