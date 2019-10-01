import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatDialog } from '@angular/material';
import { UserListDataSource } from './user-list.datasource';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';
import * as UserActions from '../store/user.actions';
import { InfoComponent } from '../../../common-dialogs';

@Component({
  selector: 'zabek-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = [ 'email', 'role', 'lab', 'actions'];
  dataSource: UserListDataSource;
  private paginatorSub: Subscription = null;
  private storeSub: Subscription = null;
  public isLoading = false;
  public count = 0;
  public usersPerPage = 10;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select('user').subscribe(state => {
      this.isLoading = state.loading;
      this.count = state.count;
      this.usersPerPage = state.usersPerPage;
      if (state.error) {
        this.dialog.open(InfoComponent, { data:  state.error });
      }
      if (this.paginator && this.paginator.pageIndex !== state.page ) {
        this.paginator.pageIndex = state.page;
      } 
    });

    this.dataSource = new UserListDataSource(this.store);  
     
    this.store.dispatch(UserActions.fetchUsers({page: 0}))
  
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
          tap(() => this.store.dispatch(UserActions.fetchUsers({page: this.paginator.pageIndex})))
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

  loadUsersPage() {
    this.store.dispatch(UserActions.fetchUsers({page: this.paginator.pageIndex}));
  }

  onDelete(_id: string) {
    this.store.dispatch(UserActions.deleteUser({_id}));
  }

}