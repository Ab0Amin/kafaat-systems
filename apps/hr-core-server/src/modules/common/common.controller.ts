import { Controller, Get, Headers } from '@nestjs/common';
import { UserAgentService } from './services/user-agent.service';

@Controller('common')
export class CommonController {
  constructor(private userAgentService: UserAgentService) {}

  @Get('get-user-info')
  getUserInfo(@Headers('user-agent') userAgent: string) {
    return this.userAgentService.parse(userAgent);
  }
}
