
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSchema, FileUploadSchema, UserSchema } from '@zabek/data';
import { ExamController } from './exam.controler';
import { ExamService } from './exam.service';
import { DoctorExamController } from './doctor-exam.controler';
import { FileuploadControler } from './fileupload.controler';
import { ConfigService } from '../config/config.service';
import { FileService } from './file.service';
import { UserService } from '../user/user.service';


@Module({
  imports: [ 
    MongooseModule.forFeature([
      {name: 'Exam', schema: ExamSchema },
      {name: 'File', schema: FileUploadSchema },
      {name: 'User', schema: UserSchema}
    ])
  ],
  controllers: [
    ExamController,
    DoctorExamController,
    FileuploadControler
  ],
  providers: [
    ExamService,
    FileService,
    ConfigService,
    UserService
  ]
})
export class ExamModule {}