import { Document, Schema } from 'mongoose';

export interface Lab extends Document {
  readonly _id: string;
  readonly name: string;
  readonly address: string;
  readonly email: string;
  readonly usersCount: number;
}

export const LabSchema = new Schema({
  name: {
    type: String,
    requred: [true, 'Nazwa pracowni jest wymagana.'],
    minLength: 5,
    maxLength: 100,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email pracowni jest wymagany.'],
    minLength: 10,
    maxLength: 50,
    unique: false
  },
  address: {
    type: String,
    required: [true, 'Adres pracowni jest wymagany'],
    minLength: 20,
    maxLength: 150,
    unique: false
  },
  usersCount: {
    type: Number,
    required: true
  }
});