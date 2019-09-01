import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { UserListDataSource } from '../_datasource/user-list.datasource';
import { UserService } from '../../_services';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'zabek-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  usersPerPage = 10;
  currentPage = 1;

  displayedColumns = [ 'email', 'role', 'lab', 'actions'];
  dataSource: UserListDataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    this.dataSource = new UserListDataSource(this.userService, this.usersPerPage);   
    this.dataSource.loadUsers(this.currentPage, this.usersPerPage);
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => this.loadUsersPage())
        )
        .subscribe();
  }

  loadUsersPage() {
      this.dataSource.loadUsers( this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  onDelete(id: string) {
    this.userService.deleteUser(id)
      .subscribe(res => {
        if (this.dataSource.itemsOnPage === 1 ) {
          this.paginator.pageIndex = this.paginator.pageIndex -1;
        }
        this.loadUsersPage();
      });
  }

}
