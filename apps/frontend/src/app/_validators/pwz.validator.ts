import { AbstractControl } from '@angular/forms';
import { isValidPwz } from '@zabek/util';

export class PwzValidator {

  static validPwz(control: AbstractControl): {[key: string]: any} {
      if (!control.value) {
        return;
      }
      if (!isValidPwz(control.value)) {
        return {validPwz: true};
      } 
    }

}