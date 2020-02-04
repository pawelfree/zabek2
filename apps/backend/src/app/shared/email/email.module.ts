import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ExamSchema, UserSchema } from '@zabek/data';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../../user/user.service';
import { ExamService } from '../../exam/exam.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {name: 'Exam', schema: ExamSchema },
      {name: 'User', schema: UserSchema }
  ])
  ],
  providers: [
    ConfigService,
    EmailService,
    ExamService,
    UserService
  ],
  controllers: [
    EmailController
  ]
})
export class EmailModule {}
