import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URL),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
