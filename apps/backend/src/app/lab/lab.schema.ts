import * as mongoose from 'mongoose';

export const LabSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 50,
    unique: false
  },
  address: {
    type: String,
    required: true,
    minLength: 20,
    maxLength: 150,
    unique: true
  }
});
