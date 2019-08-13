import { Document } from 'mongoose';

export interface Lab extends Document {
  readonly _id: string;
  readonly name: string;
  readonly address: string;
  readonly email: string;
}
