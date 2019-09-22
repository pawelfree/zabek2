import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { isValidPesel } from '@zabek/util';

export class PeselValidator {

  static validPesel(control: AbstractControl): {[key: string]: any} {
      if (!control.value) {
        return;
      }
      if (!isValidPesel(control.value)) {
        return {validPesel: true};
      } 
    }

}