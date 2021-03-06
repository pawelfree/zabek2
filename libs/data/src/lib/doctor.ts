import { Document, Schema } from 'mongoose';

export class Doctor implements Document {
  readonly _id: string = null;
  readonly firstName: string;
  readonly lastName: string;
  readonly officeName: string;
  readonly officeAddress: string;
  readonly qualificationsNo: string;
  readonly officeCorrespondenceAddress: string;
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
    trim: true,
    minlength: 2,
    maxLength: 25
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
    minlength: 2,
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
    trim: true,
    minLength: 5,
    maxLength: 35
  },
  officeAddress: {
    type: String,
    required: false,
    trim: true,
    minLength: 15,
    maxLength: 75
  },
  officeCorrespondenceAddress: {
    type: String,
    required: false,
    trim: true,
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
    minLength: 11,
    maxLength: 11,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    minLength: 5,
    maxLength: 50,
    unique: true,
    trim: true,  
    sparse: true
  },
});

// DoctorSchema.path('qualificationsNo').validate(function (value) {

//   isValidPwz(value);

// }, 'To nie jest poprawny numer PWZ');
