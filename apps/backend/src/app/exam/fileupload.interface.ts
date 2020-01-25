import { Document } from 'mongoose';

export interface FileUpload extends Document {
  readonly _id: string;
  readonly name: string;
  readonly key: string;
  readonly size: number;
}
