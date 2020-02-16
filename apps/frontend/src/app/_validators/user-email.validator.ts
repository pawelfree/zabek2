import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DoctorService } from '../_services';
import { map, catchError } from 'rxjs/operators';
import { User } from '@zabek/data';


@Injectable({ providedIn: 'root' })
export class UserEmailValidator implements AsyncValidator {

  constructor(private readonly doctorService: DoctorService, private user: User = null) {}

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if ((!control.value) || (control.value === '')) return of(null);
    return this.doctorService.isEmailTaken(control.value, this.user ? this.user._id: null).pipe(
      map(isTaken => (isTaken ? { uniqueEmail: true } : null)),
      catchError(() => of(null))
    );
  } 
  
}