import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('test')
export class AppController {
  constructor(private appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
