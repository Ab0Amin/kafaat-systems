import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { UserModule } from '../modules/user/user.module';
import { TenantModule } from '@kafaat-systems/tenant';
import { AdminModule } from '../modules/admin/admin.module';
import { TenantMiddleware } from '@kafaat-systems/tenant';

@Module({
  imports: [DatabaseModule.forRoot(), UserModule, TenantModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant middleware to all routes except tenant registration and admin routes
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'tenant/register', method: RequestMethod.POST },
        { path: 'admin/(.*)', method: RequestMethod.ALL }
      )
      .forRoutes('*');
  }
}
