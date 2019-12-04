import * as mongoose from 'mongoose';

export const FeedbackSchema = new mongoose.Schema({

  content: {
    type: String,
    requred: true,
    minLength: 1,
    maxLength: 1000,
    unique: false    
  },
  // TODO - poprawić
  createdAt: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: false
  },
  
  createdBy: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: false
  },

  lab: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lab',
    required: true
  },
});
