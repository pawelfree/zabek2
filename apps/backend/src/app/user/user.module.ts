
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { DoctorController } from './doctor.controller';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'User', schema: UserSchema }])
  ],
  controllers: [
    UserController,
    DoctorController
  ],
  providers: [
    AuthService,
    UserService
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}