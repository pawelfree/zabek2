import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User, Role } from '../_models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../common-dialogs';

@Component({
  selector: 'zabek-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User;
  subscription: Subscription;
  @Output() public sidenavToggle = new EventEmitter();
  
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    this.subscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get isAdmin() {
    return this.currentUser && (this.currentUser.role === Role.admin || this.currentUser.role === Role.sadmin);
  }

  get isSAdmin() {
    return this.currentUser && this.currentUser.role === Role.sadmin;
  }
  
  get isLoggedIn() {
    return this.currentUser;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent, {
       disableClose: true
    });
  }

  onToogleSideNav() {
    this.sidenavToggle.emit();
  }
} 
