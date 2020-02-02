import { Schema, Document } from 'mongoose';
import { Examination } from './examination';
import { User } from './user';

export interface FileUpload extends Document {
  readonly _id: string;
  readonly name: string;
  readonly key: string;
  readonly size: number;
  readonly exam: Examination;
  readonly user: User 
}

export const FileUploadSchema = new Schema({
  name: {
    type: String,
    requred: true
  },
  key: {
    type: String,
    required: false,
    unique: true
  },
  size: {
    type: Number,
    required: true
  },
  exam: {
    type: Schema.Types.ObjectId,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true
  }
});
