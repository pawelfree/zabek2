import { User} from '@zabek/data';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DoctorService } from '../../../_services';
import { of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorCreateResolver implements Resolve<User> {

  constructor(private readonly doctorService: DoctorService) { } 

  resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<User> {   
    if (route.paramMap.has('doctorId')) {
      const _id = route.paramMap.get('doctorId');
      return this.doctorService.getOnlineDoctor(_id);      
    } else {
        return of(null);
    } 
  }

}
