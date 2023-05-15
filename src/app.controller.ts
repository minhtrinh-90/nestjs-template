import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiTags('health check')
  @Get()
  healthCheck() {
    return 'OK';
  }
}
