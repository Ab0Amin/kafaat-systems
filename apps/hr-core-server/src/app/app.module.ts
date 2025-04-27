import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { UserModule } from '../modules/user/user.module';
import { TenantModule } from './../modules/tenant/tenant.module';
import { AdminModule } from '../modules/admin/admin.module';

import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';
import { CommonModule } from '../modules/common/common.module';
import { MIDDLEWARES } from '../modules/common/midilwares';

@Module({
  imports: [
    SchemaConfigModule,
    DatabaseModule.forRoot(),
    UserModule,
    TenantModule,
    AdminModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    for (const middlewar of MIDDLEWARES) {
      const { middleware, exclude = [] } = middlewar;
      const mw = consumer.apply(middleware);
      if (exclude.length > 0) {
        mw.exclude(...exclude);
      }
      mw.forRoutes('*');
    }
  }
}
