import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'zabek-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());
  }
}