import { Document } from 'mongoose';
import { Lab } from '../lab/lab.interface';

export interface User extends Document {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly lab: Lab;
}
