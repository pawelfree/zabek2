import { AbstractControl } from '@angular/forms';
import { isValidNIP } from '@zabek/util';

export class NIPValidator {

  static validNIP(control: AbstractControl): {[key: string]: any} {
      if (!control.value) {
        return;
      }
      if (!isValidNIP(control.value)) {
        return {validNIP: true};
      } 
    }

}