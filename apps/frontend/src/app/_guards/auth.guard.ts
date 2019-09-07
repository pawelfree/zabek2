import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(
        private readonly router: Router, 
        private readonly authService: AuthenticationService
    ) {}


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            map(user => {
                if (user) {
                    if (route.data.roles && route.data.roles.indexOf(user.role) === -1 ) {
                        this.router.navigate([user.role]);
                        return false;
                    }
                    return true;
                }
                this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
                return false;
            })
        );
    }
}