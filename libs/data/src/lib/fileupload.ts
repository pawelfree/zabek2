import { Schema, Document } from 'mongoose';

export interface FileUpload extends Document {
  readonly _id: string;
  readonly name: string;
  readonly key: string;
  readonly size: number;
}
export const FileUploadSchema = new Schema({
  name: {
    type: String,
    requred: true,
    unique: false
  },
  key: {
    type: String,
    required: false,
    unique: true
  },
  size: {
    type: Number,
    required: true,
    unique: false
  },
});