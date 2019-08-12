import * as mongoose from 'mongoose';

export const OfficeSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    minLength: 5,
    maxLength: 50,
    unique: true
  }
  //TODO adres i inne w przyszłości
});
