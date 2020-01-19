export interface Lab {
  _id: string;
  name: string;
  address: string;
  email: string;
  readonly usersCount?: number;
}