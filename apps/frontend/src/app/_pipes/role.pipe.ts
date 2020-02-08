import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'roleName'})
export class RoleNamePipe implements PipeTransform {
  transform(value: string): string {
    let role = value;

    switch (value) {
      case 'user': 
        role = 'Technik RTG';
        break;
      case 'admin': 
        role = 'Administrator';
        break;
      case 'doctor':
        role = 'Lekarz';

    }

    return role;
  }
}