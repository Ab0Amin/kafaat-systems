import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@kafaat-systems/database';
import { UserModule } from '../modules/user/user.module';
import { TenantModule } from './../modules/tenant/tenant.module';
import { AdminModule } from '../modules/admin/admin.module';
import { TenantMiddleware, TenantService } from '@kafaat-systems/tenant';
import { SchemaConfigModule } from '@kafaat-systems/schemaConfig';

@Module({
  imports: [
    SchemaConfigModule,
    DatabaseModule.forRoot(),
    UserModule,
    TenantModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, TenantService, TenantMiddleware],
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
