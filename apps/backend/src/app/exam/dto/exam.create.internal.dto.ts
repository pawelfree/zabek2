export class CreateExamInternalDto {
  patientFullName: string; // Imię i nazwisko pacjenta ze skierowania
  patientPesel: string; //pesel pacjenta ze skierowania
  patientOtherID: string; //Inny dokument tożsamości  
  patientAge: number; //z pesela - wyliczane automatycznie
  patientIsFemale: boolean; //z pesela - wyliczane automatycznie
  patientProcessingAck: boolean; //zgoda pacjenta na przetwarzanie badania
  patientMarketingAck: boolean; //zgoda pacjenta na marketing
  patientEmail: string;
  patientPhone: string;
  doctorFullName?: string; // imię i nazwisko lekarza ze skierowania
  doctorQualificationsNo?: string; // numer uprawnien lekarza
  sendEmailTo: string; // adres email, na który należy wysłać powiadomienie o gotowym badaniu do pobrania
  examinationDate: string; //data wykonania badania
  examinationType: string; //rodzaj badania
  examinationFile: string; //link do wyników badan
  lab: string;
}