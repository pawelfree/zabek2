
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { DoctorController } from './doctor.controller';
import { LabService } from '../lab/lab.service';
import { LabSchema } from '../lab/lab.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'User', schema: UserSchema }, {name: 'Lab', schema: LabSchema}])
  ],
  controllers: [
    UserController,
    DoctorController
  ],
  providers: [
    AuthService,
    UserService,
    LabService
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}