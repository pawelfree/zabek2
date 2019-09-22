import * as mongoose from 'mongoose';

export const LabSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: [true, 'Nazwa pracowni jest wymagana.'],
    validate: {
      validator: (name) => name.length > 4,
      messaage: 'Nazwa pracowni musi być dłuższa niż 4 znaki.'
    },
    maxLength: 50,
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
    unique: true
  }
});
