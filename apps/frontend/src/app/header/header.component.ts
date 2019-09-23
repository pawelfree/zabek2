import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User, Role } from '../_models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../common-dialogs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';

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
    private readonly store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.store.select('auth').pipe(
      map(authState => authState.user)
    ).subscribe(user => {
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
  
  get isUser() {
    return this.currentUser && !(this.currentUser.role === Role.doctor);
  }

  get isLoggedIn() {
    return this.currentUser;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
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
