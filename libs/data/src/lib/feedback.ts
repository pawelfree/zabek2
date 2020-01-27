import { Schema, Document }  from 'mongoose';

export interface Feedback extends Document {
  readonly _id: string;
  readonly content: string; // content of the feedback
  readonly createdAt: string; //datetime of the feedback 
  readonly createdBy: string; //email of the feedback creator  
}

export const FeedbackSchema = new Schema({
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
    type: Schema.Types.ObjectId, 
    ref: 'Lab',
    required: true
  },
});
