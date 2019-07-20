
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { userProviders } from './user.providers';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [ 
    DatabaseModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    AuthService,
    UserService,
    ...userProviders
  ],
  exports: [
      ...userProviders
  ]
})
export class UserModule {}