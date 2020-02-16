import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DoctorService } from '../_services';
import { map, catchError } from 'rxjs/operators';
import { isValidPwz } from '@zabek/util';
import { Doctor } from '@zabek/data';

@Injectable({ providedIn: 'root' })
export class UserPwzValidator implements AsyncValidator {

  constructor(private readonly doctorService: DoctorService, private readonly doctor: Doctor = null) {}

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if ((!control.value) || (control.value === '')) return of(null);
    if (!isValidPwz(control.value)) return of({validPwz: true});

    return this.doctorService.isPwzTaken(control.value, this.doctor ? this.doctor._id : null).pipe(
      map(isTaken => (isTaken ? { uniquePwz: true } : null)),
      catchError(() => of(null))
    );
  } 
  
}