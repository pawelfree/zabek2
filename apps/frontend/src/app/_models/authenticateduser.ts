import { Lab } from './lab';

export class AuthenticatedUser {
  _id: string;
  email: string;
  role: string;
  lab: Lab;
  expiresIn: number;
  token?: string;
}
