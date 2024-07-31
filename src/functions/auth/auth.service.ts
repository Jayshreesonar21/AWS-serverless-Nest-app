import * as bcrypt from 'bcryptjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { User } from '../../db/schemas/user.schema';
import { SignUpDto } from './auth.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async signup(signUpDto: SignUpDto): Promise<User> {
    // Check email already exist or not
    const { email } = signUpDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    // Create new user
    const createdUser = new this.userModel(signUpDto);
    return createdUser.save();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload: JwtPayload = { _id: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

