import { Lab } from '@zabek/data';

export class UpdateUserDto {
  readonly _id: string;
  readonly email: string; 
  readonly password: string;
  readonly role: string;
  readonly lab: Lab;
}