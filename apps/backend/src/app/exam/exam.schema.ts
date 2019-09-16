import * as mongoose from 'mongoose';

export const ExamSchema = new mongoose.Schema({
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
  patientAge: {
    type: String,
    required: false,
    minLength: 1,
    maxLength: 3,
    unique: false
  },
  patientAck: {
    type: Boolean,
    required: false,
    default: false
  },
  doctorFullName: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: false
  },
  doctorQualificationsNo: {
    type: String,
    requred: true,
    minLength: 7,
    maxLength: 7,
    unique: true
  },
  sendEmailTo: {
    type: String,
    requred: true,
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
  }
});