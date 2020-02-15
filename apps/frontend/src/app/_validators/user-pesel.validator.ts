import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DoctorService } from '../_services';
import { map, catchError } from 'rxjs/operators';
import { isValidPesel } from '@zabek/util';

@Injectable({ providedIn: 'root' })
export class UserPeselValidator implements AsyncValidator {

  constructor(private readonly doctorService: DoctorService) {}

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if ((!control.value) || (control.value === '')) return of(null);
    if (!isValidPesel(control.value)) return of({validPesel: true});

    return this.doctorService.isPeselTaken(control.value).pipe(
      map(isTaken => (isTaken ? { uniquePesel: true } : null)),
      catchError(() => of(null))
    );
  } 
  
}