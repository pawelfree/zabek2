import { Document } from 'mongoose';
import { Lab } from '../lab/lab.interface';

export interface User extends Document {
  readonly _id: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly lab?: Lab;
  readonly firstName?: string;
  readonly lastName?: string;	
  readonly officeName?: string;   
  readonly officeAddress?: string;
  readonly qualificationsNo?: string;
  readonly officeCorrespondenceAddres?: string;
  readonly examFormat?: string;
  readonly tomographyWithViewer?: boolean;
  readonly active?: boolean;
}
