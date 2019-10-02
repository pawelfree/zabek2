
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class EmailService {
  private API_KEY = null
  private sendGrid = null;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.API_KEY = configService.get('ZABEK_SENDGRID_API_KEY');
    this.sendGrid = require('sendgrid')(this.API_KEY);
  }

  sendResetTokenSuccesEmail(email: string, token: string) {
    if (this.API_KEY === 'local') {
      console.log('Reset token generated for',email);
      console.log(token);
    } else {
      const from = 'zabek@herokuapp.com';
      const to = email;
      const subject = 'Resetowanie hasła dla ząbek';
      const plain_content = 'https://zabek.herokuapp.com/resetpassword/'+token;
      this.send(from, to, subject, plain_content);
    }

  }

  sendResetTokenSuccesFailureEmail(email: string) {
    if (this.API_KEY === 'local') {
      console.log('Reset token NOT generated for', email);
    } else {
      const from = 'zabek@herokuapp.com';
      const to = email;
      const subject = 'Resetowanie hasła dla ząbek';
      const plain_content = 'Coś poszło nie tak.\n Nie jesteś naszym użytkownikiem lub posiadasz u nas inny adres email';
      this.send(from, to, subject, plain_content);
    }
  }

  private send(from: string, to: string, subject: string, plain_content: string){
    const helper = require('sendgrid').mail;
    const from_email = new helper.Email(from);
    const to_email = new helper.Email(to);
    const content = new helper.Content('text/plain', plain_content);
    const mail = new helper.Mail(from_email, subject, to_email, content);
    const request = this.sendGrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    this.sendGrid.API(request, function(error, response) {
      if (error) {
        console.log('Coś poszło nie tak przy wysyłaniu maila', error);
      } else {
        console.log('email zostal wysłany')
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
      }
    });
  }

}