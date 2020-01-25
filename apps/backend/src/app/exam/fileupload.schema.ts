import * as mongoose from 'mongoose';

export const FileUploadSchema = new mongoose.Schema({
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
