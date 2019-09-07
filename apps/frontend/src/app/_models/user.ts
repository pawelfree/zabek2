import { Lab } from './lab';

export class User {
  _id: string;
  email: string;
  role: string;
  lab: Lab;
  password?: string;
  tokenExpirationDate?: Date
  expiresIn?: number; 
  token?: string;
}
