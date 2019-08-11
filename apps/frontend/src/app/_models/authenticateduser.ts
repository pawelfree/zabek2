export class AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  expiresIn: number;
  token?: string;
}
