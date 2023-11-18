import { MailerOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Mail } from './resources/interfaces/mail.interface';

@Injectable()
export class EmailService {
  private _mailService: MailerService;

  constructor() {
    const mailerOptions: MailerOptions = {
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: 'no-reply@prueba.com',
      }
    };

    this._mailService = new MailerService(mailerOptions, undefined);
  }

  async sendByTemplate(mail: Mail) {
    await this._mailService.sendMail({
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      context: {
        mail: mail,
      },
    });
  }
}
