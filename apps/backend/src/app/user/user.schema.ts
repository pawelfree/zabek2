import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true,
    maxLength: 300
  },
  role: String
});