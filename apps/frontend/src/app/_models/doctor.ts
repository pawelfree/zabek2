import { User } from './user';

export class Doctor extends User {
  constructor(
    _id: string,
    email: string,
    lab: string,
    password?: string,
    expiresIn?: number,
    _tokenExpirationDate?: Date,
    _token?: string,
    //dla lekarza
    public firstName: string = '',
    public lastName: string = '',
    public officeName: string = '',
    public officeAddress: string = '',
    public qualificationsNo: string = '',
    public officeCorrespondenceAddres: string = '',
    public examFormat: string = 'tiff',
    public tomographyWithViewer: boolean = false,
    public active: boolean = false,
    public rulesAccepted: boolean = false,
    public pesel?: string,
    public nip?:  string
  ) {
    super(
      _id,
      email,
      'doctor',
      { _id: lab, email: null, address: null, name: null },
      password,
      expiresIn,
      _tokenExpirationDate,
      _token
    );
  }
}