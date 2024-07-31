import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UsersService } from '../users/users.service';
import { MailerService } from '../../utils/mailer/mailer.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService
  ) { }

  @Cron(CronExpression.EVERY_HOUR)
  async sendDailyReport() {
    const users = await this.usersService.getAllUsers();
    // Send mail to all users
    await Promise.all(
      users.map(async user => {
        await this.mailerService.sendEmail(user);
      })
    )
  }
}
