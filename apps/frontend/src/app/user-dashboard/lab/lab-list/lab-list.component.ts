import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { LabListDataSource } from './lab-list.datasource';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { LabActions, selectLabState} from '../../store';
import { AppActions, AppState } from '../../../store';

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
  public count = 0; 
  public labsPerPage = 10;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit() {
    this.storeSub = this.store.pipe(select(selectLabState)).subscribe(state => {
      this.count = state.count;
      this.labsPerPage = state.labsPerPage;
      if (state.error) {
        this.store.dispatch(AppActions.raiseError({message: state.error, status: null}));
      }
      if (this.paginator && this.paginator.pageIndex !== state.page ) {
        this.paginator.pageIndex = state.page;
      } 
    });

    this.dataSource = new LabListDataSource(this.store);  
     
    this.store.dispatch(LabActions.fetchLabs({page: 0}))
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
            tap(() => this.store.dispatch(LabActions.fetchLabs({page: this.paginator.pageIndex})))
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
    this.store.dispatch(LabActions.fetchLabs({page: this.paginator.pageIndex}));
  }

  onDelete(_id: string) {
    this.store.dispatch(LabActions.deleteLab({_id}));
  }

}
