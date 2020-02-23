import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Lab, User } from '@zabek/data';
import { catchError } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/';

@Injectable({ 
   providedIn: 'root'
}) 
export class DoctorRegisterResolver implements Resolve<[User, Lab]> { 

   constructor(
      private readonly http: HttpClient) { } 

   resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {    
      const lab_id = route.paramMap.get('id');
      const email = route.queryParamMap.get('email');      
      const token = route.queryParams.get('token')
      return combineLatest([  email ? this.http.get<User>(BACKEND_URL + 'user/register/' + email) : of(null), 
                              lab_id ? this.http.get<Lab>(BACKEND_URL + 'lab/' + lab_id) : of(null),
                              of(token)])
                  .pipe(catchError( err => of(null)));
   }

}
