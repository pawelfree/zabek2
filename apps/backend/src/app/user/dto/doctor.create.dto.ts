import { Lab } from '../../lab/lab.interface';

export class CreateDoctorDto {
  readonly email: string;
  readonly lab: string;
  readonly password: string;
  readonly role: string;
  readonly firstName: string;
  readonly lastName: string;	
  readonly officeName: string;   
  readonly officeAddress: string;
  readonly qualificationsNo: string;
  readonly officeCorrespondenceAddres: string;
  readonly examFormat: string;
  readonly tomographyWithViewer: boolean;
  readonly active: boolean;
  readonly rulesAccepted: boolean;
}
