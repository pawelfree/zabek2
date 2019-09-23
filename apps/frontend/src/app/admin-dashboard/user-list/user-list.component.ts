import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { UserListDataSource } from '../_datasource/user-list.datasource';
import { UserService } from '../../_services';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'zabek-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  usersPerPage = 10;
  currentPage = 0;

  displayedColumns = [ 'email', 'role', 'lab', 'actions'];
  dataSource: UserListDataSource;
  paginatorSub: Subscription = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( private readonly userService: UserService ) {}

  ngOnInit() {
    this.dataSource = new UserListDataSource(this.userService, this.usersPerPage);   
    this.dataSource.loadUsers(this.currentPage, this.usersPerPage);
  }

  ngAfterViewInit() {
    this.paginatorSub = this.paginator.page
        .pipe(
            tap(() => this.loadUsersPage())
        )
        .subscribe();
  }

  ngOnDestroy() {
    if (this.paginatorSub) {
      this.paginatorSub.unsubscribe();
      this.paginatorSub = null;
    }
  }

  loadUsersPage() {
      this.dataSource.loadUsers( this.paginator.pageIndex, this.paginator.pageSize);
  }

  onDelete(id: string) {
    //TO DO nie usuwac z labami ktore sa
    this.userService.deleteUser(id)
      .subscribe(res => {
        if (this.dataSource.itemsOnPage === 1 ) {
          this.paginator.pageIndex = this.paginator.pageIndex -1;
        }
        this.loadUsersPage();
      });
  }

}
