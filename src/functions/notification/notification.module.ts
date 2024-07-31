import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { NotificationService } from './notification.service';
import { UsersModule } from '../users/users.module';
import { MailerService } from '../../mailer/mailer.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule
  ],
  providers: [NotificationService, MailerService]
})

export class NotificationModule { }
