import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../modules/user/user.module';
// import { OwnerModule } from '../modules/owner/owner.module';

import { TenantContextService } from '@kafaat-systems/tenant-context';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@kafaat-systems/entities';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseWithTenantModule } from '../modules/database-with-tenant/database-with-tenant.module';
import { CommonModule, JwtAuthGuard, JwtStrategy, MIDDLEWARES } from '@kafaat-systems/core-app';
import { AuthModule } from '../modules/auth/auth.module';
@Module({
  imports: [
    DatabaseWithTenantModule.forRoot(),
    UserModule,
    // OwnerModule,
    CommonModule,
    JwtModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TenantContextService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
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
