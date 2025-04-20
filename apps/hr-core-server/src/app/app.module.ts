import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@kafaat-systems/database'; // Adjust the import path as necessary
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule], // Import the DatabaseModule and UserModule here
  controllers: [AppController], // Add UserController to the controllers array
  providers: [AppService],
})
export class AppModule {}
