import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) { }

  private transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: this.configService.get<string>('SMTP_USERNAME'),
      pass: this.configService.get<string>('SMTP_PASSWORD')
    }
  });

  async sendEmail(user: any) {
    const mailOptions = {
      from: `NEST_DEMO ${this.configService.get<string>('SMTP_USERNAME')}`,
      to: user.email,
      subject: 'Daily User Report',
      text: `Registered user:
        Name: ${user.name}
        Email: ${user.email}
        Age: ${user.age}
      Welcome to daily update dashboard!
      `,
    };

    const response = await this.transporter.sendMail(mailOptions);
    return response;
  }
}
