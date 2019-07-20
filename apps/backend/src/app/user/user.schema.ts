import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
const JWT_PRIVATE_KEY = 'jwtPrivateKey';

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
  role: String
});

//TODO zmienne powinny byc w konfigu 
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id, role: this.role}, JWT_PRIVATE_KEY);
}