
import { Module, HttpModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../shared/security/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, LabSchema } from '@zabek/data';
import { DoctorController } from './doctor.controller';
import { LabService } from '../lab/lab.service';
import { EmailService } from '../shared/email/email.service';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'User', schema: UserSchema }, {name: 'Lab', schema: LabSchema}]),
    HttpModule
  ],
  controllers: [
    UserController,
    DoctorController
  ],
  providers: [
    AuthService,
    UserService,
    LabService,
    EmailService
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}