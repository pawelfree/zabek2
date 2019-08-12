export class AuthenticatedUser {
  _id: string;
  email: string;
  role: string;
  expiresIn: number;
  token?: string;
}
