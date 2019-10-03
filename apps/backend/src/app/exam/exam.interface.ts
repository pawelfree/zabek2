import { Document } from 'mongoose';
import { User } from '../user/user.interface';

export interface Exam extends Document {
  readonly _id: string;
  readonly patientFullName: string; // Imię i nazwisko pacjenta ze skierowania
  readonly patientPesel: string; //pesel pacjenta ze skierowania
  readonly patientAge: number; //z pesela - wyliczane automatycznie
  readonly patientAck: boolean; //zgoda pacjenta na przetwarzanie badania
  readonly doctor: User; // imię i nazwisko lekarza ze skierowania
  readonly sendEmailTo: string; // adres email, na który należy wysłać powiadomienie o gotowym badaniu do pobrania
  readonly examinationDate: string; //data wykonania badania
  readonly examinationType: string; //rodzaj badania
  readonly examinationFile: string; //link do wyników badan
}
