import * as mongoose from 'mongoose';
import { AnimationFrameScheduler } from 'rxjs/internal/scheduler/AnimationFrameScheduler';

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
  lastName: {
    type: String,
    required: false,
    minlength: 5,
    maxLength: 25
  },
  qualificationsNo: {
    type: String,
    required: false,
    minLength: 5,
    maxLength: 25
  },
  officeName: {
    type: String,
    required: false,
    minLength: 5,
    maxLength: 35
  },
  officeAddres: {
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
  }
});
