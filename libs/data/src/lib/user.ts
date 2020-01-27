import { Lab } from './lab';

export class User {

  constructor(
    public readonly _id: string = null, 
    public email: string,
    public  role: string,
    public lab?: string,
    public password?: string,
    public expiresIn?: number, 
    private _tokenExpirationDate?: Date,
    private _token?: string,
    public active?: boolean, //to tylko po to zeby mozna bylo sprawdzac pola doktora przy logowaniu
    public rulesAccepted?: boolean //to tylko po to zeby mozna bylo sprawdzac pola doktora przy logowaniu
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
