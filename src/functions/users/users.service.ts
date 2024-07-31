import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../../db/schemas/user.schema';
import { S3Service } from '../../utils/s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly s3Service: S3Service
  ) { }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find({}).exec();
    return users;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }

    return user.toObject();
  }

  async getUserDetail(user: any): Promise<User> {
    const userData = await this.userModel.findOne({ _id: user._id }).exec();
    if (!userData) {
      throw new NotFoundException(`User not found`);
    }

    if (userData.profile) {
      const profileUrl = this.s3Service.getSignedUrl(userData.profile);
      userData.profile = profileUrl;
    }
    return userData;
  }

  async uploadProfile(user: any, profile: any): Promise<User> {
    const userData = await this.userModel.findOne({ _id: user._id }).exec();
    if (!userData) {
      throw new NotFoundException(`User not found`);
    }
    // Upload profile
    const key = await this.s3Service.uploadFile(profile);
    // Update profile path in user record
    const updatedUserData = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { profile: key },
      { new: true }
    ).exec();
    return updatedUserData;
  }
}
