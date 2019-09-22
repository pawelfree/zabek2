import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { isValid } from '@zabek/pesel';

export class PeselValidator {

  static validPesel(control: AbstractControl): {[key: string]: any} {
      if (!control.value) {
        return;
      }
      if (!isValid(control.value)) {
        return {validPesel: true};
      } 
    }

}