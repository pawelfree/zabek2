import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '@zabek/data'
import { Observable } from 'rxjs';
import { DoctorService } from '../../../_services';

@Injectable({ providedIn: 'root' }) 
export class DoctorListResolver implements Resolve<{doctors: User[], count: number}> {
  
  constructor(private readonly doctorService: DoctorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{doctors: User[], count: number}> {
    return this.doctorService.getOnlineDoctors();
  }
}
