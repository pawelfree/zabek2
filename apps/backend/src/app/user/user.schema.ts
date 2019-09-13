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
    minlength: 8,
    maxLength: 300
  },
  role: { 
    type: String,
    required: true
  },
  lab: {
    type: mongoose.Schema.Types.ObjectId , 
    ref: 'Lab',
    required: false
  },
  firstName: {
    type: String,
    required: false,
    minlength: 5,
    maxLength: 25
  },
  lastname: {
    type: String,
    required: false,
    minlength: 5,
    maxLength: 25
  }
});
