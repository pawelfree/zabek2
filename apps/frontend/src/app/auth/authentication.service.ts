import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private tokenExpirationTimer: any;
  private tokenRenewalTimer: any

  constructor(private readonly store: Store<AppState>) {}

  setLogoutTimer(expirationDuration: number) {
    const tokenRenewalTime = expirationDuration - (expirationDuration * 0.1);
    this.tokenRenewalTimer = setTimeout(_ =>{
      this.store.dispatch(AuthActions.renewTokenRequest());
    }, tokenRenewalTime);
    
    this.tokenExpirationTimer = setTimeout(_ => {
      this.store.dispatch(AuthActions.logout());  
    }, expirationDuration); 
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    if (this.tokenRenewalTimer) {
      clearTimeout(this.tokenRenewalTimer);
    }
    this.tokenExpirationTimer = null;
    this.tokenRenewalTimer = null;
  }
  
}
