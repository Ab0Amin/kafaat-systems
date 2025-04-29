import { Controller, Get, Headers } from '@nestjs/common';
import { CommonService } from './common.service';
import { UserAgentService } from './services/user-agent.service';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private userAgentService: UserAgentService
  ) {}

  @Get('get-user-info')
  getUserInfo(@Headers('user-agent') userAgent: string) {
    return this.userAgentService.parse(userAgent);
  }
}
