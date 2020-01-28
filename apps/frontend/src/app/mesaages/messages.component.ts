import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState, selectError, AppActions, selectInfo } from '../store';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ErrorComponent, InfoComponent } from '../common-dialogs';

@Component({
  selector: 'zabek-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  private dialogConfig = new MatDialogConfig();

  errors$: Observable<any>;
  infos$: Observable<any>

  constructor(private readonly store: Store<AppState>,
              private readonly dialog: MatDialog) {}

  ngOnInit() { 

    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;

    this.errors$ = this.store.pipe(
      select(selectError),
      filter(value => value !== null),
      tap(res => { this.error(res); } )
    );
    
    this.infos$ = this.store.pipe(
      select(selectInfo),
      filter(value => value !== null),
      tap(res => { this.info(res); } )
    );

  }

  error(error: { message: string, status: string}) {
    this.store.dispatch(AppActions.clearError());
    this.dialogConfig.data = error;
    this.dialog.open(ErrorComponent, this.dialogConfig);
  }

  info(info: string) {
    this.store.dispatch(AppActions.clearInfo());
    this.dialogConfig.data = info;
    this.dialog.open(InfoComponent, this.dialogConfig);
  }
}
