export class Examination {
  id: number;
  patientFirstName: string; //imie i nazwisko pacjenta
  patientLastName: string;
  patientFullName: string; // połączenie obu powyższych
  patientPesel: string; //pesele pacjenta
  patientAge: number; //z pesela?
  patientAck: boolean; //zgoda pacjenta na przetwarzanie badania
  doctorFirstName: string; // imie lekarza zlecajacego badanie 
  doctorLastName: string; // i nazwisko
  doctorFullName: string; // połączenie obu powyższych
  doctorOfficeName: string; //nazwa gabinetu lekarza zlecającego
  doctorQualificationsNo: string; // numer uprawnien lekarza
  examinationDate: string; //data wykonania badania
  examinationType: string; //rodzaj badania
  examinationFile: string; //link do wyników badan
  deleted: boolean; //soft delete
}
