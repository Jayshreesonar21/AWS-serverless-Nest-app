import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSchema } from '../../db/schemas/user.schema';
import { S3Service } from '../../utils/s3/s3.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, S3Service],
  exports: [UsersService],
})
export class UsersModule { }
