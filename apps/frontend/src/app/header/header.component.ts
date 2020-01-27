import { Component, OnInit } from '@angular/core';
import { User } from '@zabek/data';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from '../common-dialogs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { AuthActions, currentUser } from '../auth/store';

@Component({
  selector: 'zabek-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User>;

  constructor(
    private readonly router: Router,
    private readonly store: Store<AppState>,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUser$ = this.store.pipe(select(currentUser));
  }

  authorized(role: string, roles: string[]) {
    return roles.indexOf(role) !== -1;
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
} 
