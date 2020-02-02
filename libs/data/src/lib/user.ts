import { Document, Schema } from 'mongoose';
import { Doctor } from './doctor';
import { Lab } from './lab';

export class User implements Document {
  readonly _id: string = null;
  readonly email: string;
  readonly role: string;
  readonly lab: Lab;
  readonly password?: string;
  readonly expiresIn?: number; 
  private _tokenExpirationDate?: Date;
  private _token?: string;
  readonly active: boolean;
  readonly rulesAccepted: boolean;
  readonly doctor?: Doctor

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }
 
}

export const UserSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'Lab',
    required: false
  },
  active: {
    type: Boolean,
    required: false,
    default: false
  },
  rulesAccepted: {
    type: Boolean,
    required: false,
    default: false
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: false,
  }
});

