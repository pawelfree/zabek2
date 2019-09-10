import { Lab } from './lab';

export class User {
  _id: string;
  email: string;
  role: string;
  //lab powinien byc z ?
  lab: Lab;
  password?: string;
  tokenExpirationDate?: Date
  expiresIn?: number; 
  token?: string;
}
