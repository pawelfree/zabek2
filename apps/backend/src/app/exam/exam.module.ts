
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSchema } from './exam.schema';
import { ExamController } from './exam.controler';
import { ExamService } from './exam.service';
import { DoctorExamController } from './doctor-exam.controler';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Exam', schema: ExamSchema }])
  ],
  controllers: [
    ExamController,
    DoctorExamController
  ],
  providers: [
    ExamService
  ]
})
export class ExamModule {}