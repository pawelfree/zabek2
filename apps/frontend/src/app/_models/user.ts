import { Lab } from './lab';

export class User {

  constructor(
    public readonly _id: string = null, 
    public email: string,
    public  role: string,
    public lab?: Lab,
    public password?: string,
    public expiresIn?: number, 
    private _tokenExpirationDate?: Date,
    private _token?: string,

  ){}

    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }

    get tokenExpirationDate() {
      return this._tokenExpirationDate;
    }

}
