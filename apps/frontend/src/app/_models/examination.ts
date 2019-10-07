import { Doctor } from './doctor';

export class Examination {
  _id: string;
  patientFullName: string; // Imię i nazwisko pacjenta ze skierowania
  patientPesel: string; //pesel pacjenta ze skierowania
  patientOtherID: string; //Inny dokument tożsamości
  patientAge: number; //z pesela - wyliczane automatycznie
  patientIsFemale : boolean; // czy pacjent jest kobietą, z pesel
  patientProcessingAck: boolean; //zgoda pacjenta na przetwarzanie badania
  patientMarketingAck: boolean; //zgoda pacjenta na marketing
  patientEmail: string;
  patientPhone: string;
  doctor: Doctor; 
  sendEmailTo: string; // adres email, na który należy wysłać powiadomienie o gotowym badaniu do pobrania
  examinationDate: string; //data wykonania badania
  examinationType: string; //rodzaj badania
  examinationFile: string; //link do wyników badan
}
