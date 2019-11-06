
import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { take } from 'rxjs/operators';

@Injectable()
export class EmailService {
  private API_KEY = null

  private SYSTEM_NAME = null
  private APP_SERVER = null;
  private PASSWORD_RESET_PATH = null
  private PASSWORD_RESET_TEMPLATE_ID = null;
  private PASSWORD_RESET_ERROR_TEMPLATE_ID = null;
  private DOCTOR_ACTIVATION_TEMPLATE_ID = null;
  private COMMENT_ACKNOWLEDGEMENT_TEMPLATE_ID = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService
  ) {
    this.API_KEY = configService.get('ZABEK_SENDGRID_API_KEY');
    this.SYSTEM_NAME = configService.get('SYSTEM_NAME');
    this.APP_SERVER = configService.get('APP_SERVER');

    this.PASSWORD_RESET_PATH = configService.get('PASSWORD_RESET_PATH');
    this.PASSWORD_RESET_TEMPLATE_ID = configService.get('PASSWORD_RESET_TEMPLATE_ID');

    this.PASSWORD_RESET_ERROR_TEMPLATE_ID = configService.get('PASSWORD_RESET_ERROR_TEMPLATE_ID');

    this.DOCTOR_ACTIVATION_TEMPLATE_ID = configService.get('DOCTOR_ACTIVATION_TEMPLATE_ID');

    this.COMMENT_ACKNOWLEDGEMENT_TEMPLATE_ID = configService.get('COMMENT_ACKNOWLEDGEMENT_TEMPLATE_ID')

  }

  sendResetTokenSuccesEmail(email: string, token: string) {    
    if (this.API_KEY === 'local') {
      console.log('Reset token email generated for',email);
      console.log(token);
    } else {
      this.http.post("https://api.sendgrid.com/v3/mail/send", 
      {
        "personalizations": [{
          "to": [{
            "email": email,
          }],
          "dynamic_template_data": {
            "system_name": this.SYSTEM_NAME,
            "app_server": this.APP_SERVER,
            "password_reset_path": this.PASSWORD_RESET_PATH,
            "reset_token": token
          }
        }],
        "from": {
          "email": "noreply@zabek.pl"
        },
        "template_id": this.PASSWORD_RESET_TEMPLATE_ID
      },{
        headers: {
          "content-type": "application/json",
          "Authorization": "Bearer " + this.API_KEY
        }
      }).pipe(take(1)).subscribe(
        succ => console.log('Wysłany email resetu hasła dla', email), 
        err => console.log('Błąd wysyłania resetu maila dla', email)
      );
    }
  }

  sendResetTokenSuccesFailureEmail(email: string) {
    if (this.API_KEY === 'local') {
      console.log('Reset token NOT generated for', email);
    } else {
      this.http.post("https://api.sendgrid.com/v3/mail/send", 
      {
        "personalizations": [{
          "to": [{
            "email": email,
          }],
          "dynamic_template_data": {
            "system_name": this.SYSTEM_NAME,
            "app_server": this.APP_SERVER
          }
        }],
        "from": {
          "email": "noreply@zabek.pl"
        },
        "template_id": this.PASSWORD_RESET_ERROR_TEMPLATE_ID
      },{
        headers: {
          "content-type": "application/json",
          "Authorization": "Bearer " + this.API_KEY
        }
      }).pipe(take(1)).subscribe(
        succ => console.log('Wysłany email błędu resetu hasła dla', email), 
        err => console.log('Błąd wysyłania błędu resetu maila dla', email)
      );
    }
  }

  sendUserActivatedEmail(email: string) {
    if (this.API_KEY === 'local') {
      console.log('User activate email for', email);
    } else {
      this.http.post("https://api.sendgrid.com/v3/mail/send", 
      {
        "personalizations": [{
          "to": [{
            "email": email,
          }],
          "dynamic_template_data": {
            "system_name": this.SYSTEM_NAME,
            "app_server": this.APP_SERVER
          }
        }],
        "from": {
          "email": "noreply@zabek.pl"
        },
        "template_id": this.DOCTOR_ACTIVATION_TEMPLATE_ID
      },{
        headers: {
          "content-type": "application/json",
          "Authorization": "Bearer " + this.API_KEY
        }
      }).pipe(take(1)).subscribe(
        succ => console.log('Wysłany email aktywacji lekarza dla', email), 
        err => console.log('Błąd wysyłania aktywacji lekarza dla', email)
      );
    }
  }

}