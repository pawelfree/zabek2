import { Document, Schema } from 'mongoose';
import { Doctor } from '@zabek/data';
import { Lab } from './lab';
import { FileUpload } from './fileupload';

export interface Patient extends Document {
  readonly fullName: string;
  readonly pesel: string;
  readonly otherID: string;
  readonly age: number;
  readonly female: boolean;
  readonly processingAck: boolean;
  readonly marketingAck: boolean;
  readonly email: string;
  readonly phone: string;  
}

export interface Examination extends Document {
  readonly _id: string;
  readonly doctor?: Doctor; 
  readonly patient: Patient;
  readonly lab: Lab;
  readonly sendEmailTo: string; 
  readonly examinationDate: string; 
  readonly examinationType: string; 
  readonly file: FileUpload;
  readonly firstDownload?: string;
  readonly lastDownload?: string;
}

export const PatientSchema = new Schema({
  fullName: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: false
  },
  pesel: {
    type: String,
    required: false,
    minLength: 11,
    maxLength: 11,
    unique: false
  },
  otherID: {
    type: String,
    required: false,
    minLength: 0,
    maxLength: 50,
    unique: false
  },
  age: {
    type: Number,
    required: false,
    minLength: 1,
    maxLength: 3,
    unique: false
  },
 female: {
    type: Boolean,
    required: false,
    default: false
  },  
  processingAck: {
    type: Boolean,
    required: false,
    default: false
  },
  marketingAck: {
    type: Boolean,
    required: false,
    default: false
  },
  email: {
    type: String,
    requred: false,
    minLength: 5,
    maxLength: 100,
    unique: false
  },
  phone: {
    type: String,
    requred: false,
    minLength: 0,
    maxLength: 50,
    unique: false
  }
})

export const ExamSchema = new Schema({
  patient: PatientSchema,
  doctor: {
    type: Schema.Types.ObjectId, 
    ref: 'Doctor',
    requred: false,
  },
  sendEmailTo: {
    type: String,
    requred: false,
    minLength: 5,
    maxLength: 50,
    unique: false
  },
  examinationDate: {
    type: String,
    requred: true,
    minLength: 10,
    maxLength: 10,
    unique: false
  },
  examinationType: {
    type: String,
    requred: true,
    minLength: 1,
    maxLength: 50,
    unique: false
  },
  lab: {
    type: Schema.Types.ObjectId, 
    ref: 'Lab',
    required: true
  },
  file: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },
  firstDownload: {
    type: String,
    required: false
  },
  lastDownload: {
    type: String,
    required: false
  } 
});
