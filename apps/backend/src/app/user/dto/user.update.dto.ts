import { Lab } from '../../lab/lab.interface';

export class UpdateUserDto {
  readonly _id: string;
  readonly email: string; 
  readonly password: string;
  readonly role: string;
  readonly lab: Lab;
}