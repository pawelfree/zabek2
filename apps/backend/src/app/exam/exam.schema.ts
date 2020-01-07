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
    type: mongoose.Schema.Types.ObjectId, 
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
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lab',
    required: true
  },
});
