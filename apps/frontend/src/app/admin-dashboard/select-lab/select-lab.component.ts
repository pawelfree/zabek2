import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatDialogRef } from '@angular/material';
import { LabListDataSource } from '../lab/lab-list/lab-list.datasource';
import { Subscription } from 'rxjs';

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
    //TODO remove
    // private readonly store: Store<LabState>
  ) { }

  ngOnInit() {
    //TODO remove
    // this.store.dispatch(LabActions.setLabsPerPage({labsPerPage: 5}));

    // this.storeSub = this.store.pipe(select(selectLabState)).subscribe(state => {
    //   this.isLoading = state.loading;
    //   this.count = state.count;
    //   this.labsPerPage = state.labsPerPage;
    // });
    //TODO TO JEST zle
    // this.dataSource = new LabListDataSource(null);   
    // this.store.dispatch(LabActions.fetchLabs({page: 0}))
  }

  ngAfterViewInit() {
    //TODO naprawic
    // this.paginatorSub = this.paginator.page
    //     .pipe(
    //         tap(() => this.store.dispatch(LabActions.fetchLabs({page: this.paginator.pageIndex})))
    //     )
    //     .subscribe();
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
    //TODO remove
    //this.store.dispatch(LabActions.fetchLabs({page: this.paginator.pageIndex}));
  }

  onRowClicked(row){
    this.dialogRef.close(row)
  }

}
