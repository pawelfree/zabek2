import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { take, map, tap } from 'rxjs/operators';
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
            tap(()=> {
                console.log('route ', route);
                console.log('state' , state)
            }),
            map(user => {
                if (user) {
                    if (route.data.roles && route.data.roles.indexOf(user.role) === -1 ) {
                        console.log('redirect to role')
                        return this.router.createUrlTree([user.role]);
                    }
                    console.log('true')
                    return true;
                }
                console.log('redirect to login')
                return this.router.createUrlTree(['login'], {queryParams: {returnUrl: state.url}});
            })
        );
    }
}