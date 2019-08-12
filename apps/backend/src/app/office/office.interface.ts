import { Document } from 'mongoose';

export interface Office extends Document {
  readonly _id: string;
  readonly name: string;
}
