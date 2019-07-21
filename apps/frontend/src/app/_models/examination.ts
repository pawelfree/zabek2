export class Examination {
  id: number;
  patientFirstName: string; //imie i nazwisko pacjenta
  patientLastName: string;
  patientPesel: string; //pesele pacjenta
  patientAge: number; //z pesela?
  patientAck: boolean; //zgoda pacjenta na przetwarzanie badania
  doctorFirstName: string;
  doctorLastName: string;
  doctorQualificationsNo: string;
  examinationDate: string; //data wykonania badania
  examinationType: string; //rodzaj badania
  examinationFile: string; //link do wyników badan
  deleted: boolean; //soft delete
}
