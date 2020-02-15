import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DoctorService } from '../_services';
import { map, catchError } from 'rxjs/operators';
import { isValidNIP } from '@zabek/util';

@Injectable({ providedIn: 'root' })
export class UserNipValidator implements AsyncValidator {

  constructor(private readonly doctorService: DoctorService) {}

  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    if ((!control.value) || (control.value === '')) return of(null);
    if (!isValidNIP(control.value)) return of({validNip: true});

    return this.doctorService.isNipTaken(control.value).pipe(
      map(isTaken => (isTaken ? { uniqueNip: true } : null)),
      catchError(() => of(null))
    );
  } 
  
}