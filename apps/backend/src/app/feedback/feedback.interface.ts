export interface Feedback extends Document {
  readonly _id: string;
  readonly content: string; // content of the feedback
  readonly createdAt: string; //datetime of the feedback 
  readonly createdBy: string; //email of the feedback creator  
}
