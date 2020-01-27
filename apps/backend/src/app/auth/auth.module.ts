import { Module, HttpModule } from '@nestjs/common';
import { AuthController } from './auth.controler';
import { AuthService } from '../shared/security/auth.service';
import { UserService } from '../user/user.service';
import { UserSchema } from '@zabek/data';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '../config/config.service';
import { EmailService } from '../shared/email/email.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'User', schema: UserSchema }]),
    HttpModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    UserService,
    ConfigService,
    EmailService
  ]
})
export class AuthModule {}