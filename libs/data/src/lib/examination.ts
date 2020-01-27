import { Document, Schema } from 'mongoose';
import { IUser } from '@zabek/data';

export interface Examination extends Document {
  readonly _id: string;
  readonly patientFullName: string; // Imię i nazwisko pacjenta ze skierowania
  readonly patientPesel: string; //pesel pacjenta ze skierowania
  readonly patientOtherID: string; //Inny dokument tożsamości
  readonly patientAge: number; //z pesela - wyliczane automatycznie
  readonly patientIsFemale: boolean; //z pesela - wyliczane automatycznie
  readonly patientProcessingAck: boolean; //zgoda pacjenta na przetwarzanie badania
  readonly patientMarketingAck: boolean; //zgoda pacjenta na działania marketingowe
  readonly patientEmail: string;
  readonly patientPhone: string;
  readonly doctor?: IUser; // imię i nazwisko lekarza ze skierowania
  readonly sendEmailTo: string; // adres email, na który należy wysłać powiadomienie o gotowym badaniu do pobrania
  readonly examinationDate: string; //data wykonania badania
  readonly examinationType: string; //rodzaj badania
  readonly examinationFile: string; //link do wyników badan
}

export const ExamSchema = new Schema({
  patientFullName: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: false
  },
  patientPesel: {
    type: String,
    required: false,
    minLength: 11,
    maxLength: 11,
    unique: false
  },
  patientOtherID: {
    type: String,
    required: false,
    minLength: 0,
    maxLength: 50,
    unique: false
  },
  patientAge: {
    type: String,
    required: false,
    minLength: 1,
    maxLength: 3,
    unique: false
  },
  patientIsFemale: {
    type: Boolean,
    required: false,
    default: false
  },  
  patientProcessingAck: {
    type: Boolean,
    required: false,
    default: false
  },
  patientMarketingAck: {
    type: Boolean,
    required: false,
    default: false
  },
  patientEmail: {
    type: String,
    requred: false,
    minLength: 5,
    maxLength: 100,
    unique: false
  },
  patientPhone: {
    type: String,
    requred: false,
    minLength: 0,
    maxLength: 50,
    unique: false
  },      
  doctor: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
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
  examinationFile: {
    type: String,
    requred: false,
    minLength: 1,
    maxLength: 500,
    unique: false
  },
  lab: {
    type: Schema.Types.ObjectId, 
    ref: 'Lab',
    required: true
  },
});
