export class AuthenticatedUser {
  _id: string;
  email: string;
  role: string;
  lab: string;
  expiresIn: number;
  token?: string;
}
