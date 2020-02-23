import { Component, OnInit } from '@angular/core';
import { User } from '@zabek/data';
import { Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../common-dialogs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { AuthActions, currentUser } from '../auth/store';
import { DoctorEditComponent } from '../register/doctor-edit/doctor-edit.component';
import { AppActions } from '../store';
import { DoctorService } from '../_services';
import { finalize } from 'rxjs/operators';

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
    private readonly dialog: MatDialog,
    private readonly doctorService: DoctorService
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
    this.dialog.open(ChangePasswordComponent, { disableClose: true });
  }

  openDoctorEditDialog() {
    this.store.dispatch(AppActions.loadingStart());
    this.doctorService.getOnlineDoctorMe().pipe(
      finalize(() => this.store.dispatch(AppActions.loadingEnd()))).subscribe(
        user => {
          if (user) {
            this.dialog.open(DoctorEditComponent, { disableClose: true, data: user});
          } else {
            this.store.dispatch(AppActions.raiseError({message: 'Nie można pobrać danych o lekarzu.', status: ''}));
          }
        },
        err => {
          this.store.dispatch(AppActions.raiseError({message: 'Nie można pobrać danych o lekarzu', status: err}))
        }
      )

  }
} 
