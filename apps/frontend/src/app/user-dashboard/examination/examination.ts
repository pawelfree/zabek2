export class Examination {
  id: number;
  patientFullName: string; // połączenie obu powyższych
  patientPesel: string; //pesele pacjenta
  patientAge: number; //z pesela?
  patientAck: boolean; //zgoda pacjenta na przetwarzanie badania
  doctorFullName: string; // połączenie obu powyższych
  doctorOfficeName: string; //nazwa gabinetu lekarza zlecającego
  doctorQualificationsNo: string; // numer uprawnien lekarza
  examinationDate: string; //data wykonania badania
  examinationType: string; //rodzaj badania
  examinationFile: string; //link do wyników badan

  //TODO remove
  title: string;
  url: string;
  created_at: string;
  state: string;
  updated_at: string;
  
}
