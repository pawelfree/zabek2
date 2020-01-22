export class CreateExamInternalDto {
  readonly patientFullName: string; // Imię i nazwisko pacjenta ze skierowania
  readonly patientPesel: string; //pesel pacjenta ze skierowania
  readonly patientOtherID: string; //Inny dokument tożsamości  
  readonly patientAge: number; //z pesela - wyliczane automatycznie
  readonly patientIsFemale: boolean; //z pesela - wyliczane automatycznie
  readonly patientProcessingAck: boolean; //zgoda pacjenta na przetwarzanie badania
  readonly patientMarketingAck: boolean; //zgoda pacjenta na marketing
  readonly patientEmail: string;
  readonly patientPhone: string;
  readonly sendEmailTo: string; // adres email, na który należy wysłać powiadomienie o gotowym badaniu do pobrania
  readonly examinationDate: string; //data wykonania badania
  readonly examinationType: string; //rodzaj badania
  readonly examinationFile: string; //link do wyników badan
  readonly lab: string;
  readonly doctor: string;
}