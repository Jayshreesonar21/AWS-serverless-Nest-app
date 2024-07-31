import { Controller, Post, Body, Res, Req, HttpStatus, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './auth.service';
import { SignUpDto } from './auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  async signup(@Res() res: Response, @Body() signUpDto: SignUpDto) {
    const result = await this.authService.signup(signUpDto);
    return res.status(HttpStatus.CREATED).send({
      message: 'User created successfully!',
      data: result
    })
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }
}

