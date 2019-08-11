import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../_models';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../_services';
import { PageEvent } from '@angular/material';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'zabek-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  currentUser: User;
  userSubscription: Subscription;
  dataSubscription: Subscription;
  users: User[] = [];
  isLoading = false;
  totalUsers = 0;
  usersPerPage = 15;
  currentPage = 1;

  constructor(
    private readonly authService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUsers(this.usersPerPage, this.currentPage);
    this.dataSubscription = this.userService
      .getUserUpdateListener()
      .subscribe((userData: { users: User[]; userCount: number }) => {
        this.isLoading = false;
        this.totalUsers = userData.userCount;
        this.users = userData.users;
      });
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  onDelete(userId: string) {
    this.isLoading = true;
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.userService.getUsers(this.usersPerPage, this.currentPage);
      },
      err => {
        this.userService.getUsers(this.usersPerPage, this.currentPage);
      }
    );
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.usersPerPage = event.pageSize;
    this.userService.getUsers(this.usersPerPage, this.currentPage);
  }
}
