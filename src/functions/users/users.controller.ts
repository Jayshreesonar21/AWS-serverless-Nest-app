import { Controller, Req, UseGuards, Get, UseInterceptors, UploadedFile, Post, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('detail')
  async getUserDetail(@Req() req: Request) {
    return this.usersService.getUserDetail(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile')
  @UseInterceptors(FileInterceptor('profile'))
  async uploadProfile(@Req() req: Request, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png)/ })
      ],
    })
  ) profile: Express.Multer.File) {
    return this.usersService.uploadProfile(req.user, profile);
  }
}
