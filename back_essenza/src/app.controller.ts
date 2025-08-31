import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): any {
    return { message: 'Test route working', timestamp: new Date().toISOString() };
  }

  @Get('health')
  getHealth(): any {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
