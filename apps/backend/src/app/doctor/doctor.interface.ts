import { Document } from 'mongoose';

export interface Doctor extends Document {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;	
  readonly officeName: string;   
  readonly officeAddress: string;
  readonly qualificationsNo: string;
  readonly officeCorrespondenceAddres: string;
  readonly examFormat: string;
  readonly tomographyWithViewer: boolean;
  readonly active: boolean;
}
