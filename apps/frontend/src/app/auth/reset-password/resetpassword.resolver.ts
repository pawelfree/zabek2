import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ 
   providedIn: 'root'
}) 
export class ResetPasswordResolver implements Resolve<string> { 

   constructor() { } 

   resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {      
      if (route.paramMap.has('id')) {
         return route.paramMap.get('id');         
      } else {
         return null;
      } 
   }
}
