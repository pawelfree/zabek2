import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DoctorService } from '../_services';
import { map, catchError } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class UserEmailValidator implements AsyncValidator {

  constructor(private readonly doctorService: DoctorService) {}

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if ((!control.value) || (control.value === '')) return of(null);
    return this.doctorService.isEmailTaken(control.value).pipe(
      map(isTaken => (isTaken ? { uniqueEmail: true } : null)),
      catchError(() => of(null))
    );
  } 
  
}