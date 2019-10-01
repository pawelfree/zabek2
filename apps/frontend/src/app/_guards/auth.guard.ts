import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { take, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(
        private readonly router: Router, 
        private readonly store: Store<AppState>
    ) {}


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => authState.user),
            map(user => {
                if (user) {
                    if (route.data.roles && route.data.roles.indexOf(user.role) === -1 ) {
                        return this.router.createUrlTree([user.role]);
                    }
                    return true;
                }
                return this.router.createUrlTree(['login'], {queryParams: {returnUrl: state.url}});
            })
        );
    }
}