import { Doctor } from '@zabek/data';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { DoctorService } from '../../_services';
import { of, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorEditResolver implements Resolve<Doctor> {

  constructor(private readonly doctorService: DoctorService) { } 

  resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Doctor> {   
    if (route.paramMap.has('doctorId')) {
      const _id = route.paramMap.get('doctorId');
      return this.doctorService.getDoctor(_id);      
    } else {
        return of(null);
    } 
  }

}
