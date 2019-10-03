import { Doctor } from './doctor';

export class Examination {
  _id: string;
  patientFullName: string; // Imię i nazwisko pacjenta ze skierowania
  patientPesel: string; //pesel pacjenta ze skierowania
  patientAge: number; //z pesela - wyliczane automatycznie
  patientAck: boolean; //zgoda pacjenta na przetwarzanie badania
  doctor: Doctor; 
  sendEmailTo: string; // adres email, na który należy wysłać powiadomienie o gotowym badaniu do pobrania
  examinationDate: string; //data wykonania badania
  examinationType: string; //rodzaj badania
  examinationFile: string; //link do wyników badan
}
