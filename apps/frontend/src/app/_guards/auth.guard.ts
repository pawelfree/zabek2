import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(
        private readonly router: Router, 
        private readonly authService: AuthenticationService
    ) {}


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1 ) {
                this.router.navigate([currentUser.role]);
                return false;
            }
            return true;
        }

        this.router.navigate(['login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

}