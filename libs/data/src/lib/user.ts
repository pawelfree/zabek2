import { Document, Schema } from 'mongoose';
import { isValidPwz } from '@zabek/util';

export interface IUser extends Document {
  readonly _id: string;
  readonly email: string;
  readonly password?: string;
  readonly role: string;
  readonly lab?: string;
  readonly firstName?: string;
  readonly lastName?: string;	
  readonly officeName?: string;   
  readonly officeAddress?: string;
  readonly qualificationsNo?: string;
  readonly officeCorrespondenceAddres?: string;
  readonly examFormat?: string;
  readonly tomographyWithViewer?: boolean;
  readonly active?: boolean;
  readonly rulesAccepted?: boolean;
  readonly nip?: string;
  readonly pesel?: string;
}

export class User implements IUser {

  constructor(
    public readonly _id: string = null, 
    public email: string,
    public  role: string,
    public lab?: string,
    public password?: string,
    public expiresIn?: number, 
    private _tokenExpirationDate?: Date,
    private _token?: string,
    public active?: boolean, //to tylko po to zeby mozna bylo sprawdzac pola doktora przy logowaniu
    public rulesAccepted?: boolean //to tylko po to zeby mozna bylo sprawdzac pola doktora przy logowaniu
  ){}

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
  firstName: {
    type: String,
    required: false,
    minlength: 2,
    maxLength: 25
  },
  lastName: {
    type: String,
    required: false,
    minlength: 5,
    maxLength: 25
  },
  qualificationsNo: {
    type: String,
    // validate: {
    //   validator: function(value) {
    //     return isValidPwz(value);
    //   },
    //   message: props => `${props.value} nie jest poprawnym numerem PWZ`
    // },
    required: false,
    // minLength: 5,
    // maxLength: 25
  },
  officeName: {
    type: String,
    required: false,
    minLength: 5,
    maxLength: 35
  },
  officeAddress: {
    type: String,
    required: false,
    minLength: 15,
    maxLength: 75
  },
  officeCorrespondenceAddres: {
    type: String,
    required: false,
    minLength: 15,
    maxLength: 75
  },
  examFormat: {
    type: String,
    required: false,
    minLength: 4,
    maxLength: 5
  },
  tomographyWithViewer: {
    type: Boolean,
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
  nip: {
    type: String,
    required: false,
    minLength: 10,
    maxLength: 10,
    unique: false
  },
  pesel: {
    type: String,
    required: false,
    minLength: 11,
    maxLength: 11,
    unique: false
  }
});

UserSchema.path('qualificationsNo').validate(function (value) {

  isValidPwz(value);

}, 'To nie jest poprawny numer PWZ');

