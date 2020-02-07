import { Document, Schema } from 'mongoose';
import { isValidPwz } from '@zabek/util';


export class Doctor implements Document {
  readonly _id: string = null;
  readonly firstName: string;
  readonly lastName: string;
  readonly officeName: string;
  readonly officeAddress: string;
  readonly qualificationsNo: string;
  readonly officeCorrespondenceAddres: string;
  readonly examFormat: string = 'tiff';
  readonly tomographyWithViewer: boolean;
  readonly pesel?: string;
  readonly nip?:  string;
  readonly email?: string;
}

export const DoctorSchema = new Schema({
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
    unique: true,
    trim: true,    
    sparse: true
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
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 50,
    unique: true,
    trim: true, 
    index: true,     
    sparse: true
  },
});

// DoctorSchema.path('qualificationsNo').validate(function (value) {

//   isValidPwz(value);

// }, 'To nie jest poprawny numer PWZ');
