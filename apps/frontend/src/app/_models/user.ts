import { Lab } from './lab';

export class User {
  _id: string;
  email: string;
  role: string;
  password?: string;
  lab: Lab;
}
