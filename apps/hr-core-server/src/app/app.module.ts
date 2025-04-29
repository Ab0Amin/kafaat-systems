import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { UserModule } from '../modules/user/user.module';
import { OwnerModule } from '../modules/owner/owner.module';

import { CommonModule } from '../modules/common/common.module';
import { TenantContextService } from '@kafaat-systems/tenant-context';
import { MIDDLEWARES } from '../modules/common/midilwares';

@Module({
  imports: [DatabaseModule.forRoot(), UserModule, OwnerModule, CommonModule],
  controllers: [AppController],
  providers: [AppService, TenantContextService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    for (const middlewar of MIDDLEWARES) {
      const { middleware, exclude = [], include = [] } = middlewar;
      const mw = consumer.apply(middleware);
      if (exclude.length > 0) {
        mw.exclude(...exclude);
      }
      if (include.length > 0) {
        mw.forRoutes(...include);
      } else {
        mw.forRoutes('*');
      }
    }
  }
}
