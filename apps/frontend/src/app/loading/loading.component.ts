import { Component, OnInit } from '@angular/core';
import { Observable, merge } from "rxjs";
import { map, filter } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd } from "@angular/router";
import { select, Store } from '@ngrx/store';
import { AppState, selectLoading } from '../store';

@Component({
  selector: 'zabek-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  loading$: Observable<boolean>;

  constructor(private readonly router: Router,
              private readonly store: Store<AppState>) {}

  ngOnInit() {

    this.loading$ = merge(
      this.store.pipe(select(selectLoading)),
      this.router.events.pipe(
      filter(event => event instanceof NavigationStart || event instanceof NavigationEnd),
      map(event => event instanceof NavigationStart))
    );

  }

}

