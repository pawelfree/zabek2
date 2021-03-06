import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DoctorService } from '../_services';
import { map, catchError } from 'rxjs/operators';
import { isValidPesel } from '@zabek/util';
import { Doctor } from '@zabek/data';

@Injectable({ providedIn: 'root' })
export class UserPeselValidator implements AsyncValidator {

  constructor(private readonly doctorService: DoctorService, private readonly doctor: Doctor = null) {}

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if ((!control.value) || (control.value === '')) return of(null);
    if (!isValidPesel(control.value)) return of({validPesel: true});

    return this.doctorService.isPeselTaken(control.value, this.doctor ? this.doctor._id : null).pipe(
      map(isTaken => (isTaken ? { uniquePesel: true } : null)),
      catchError(() => of(null))
    );
  }
}
