
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamSchema } from './exam.schema';
import { ExamController } from './exam.controler';
import { ExamService } from './exam.service';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Exam', schema: ExamSchema }])
  ],
  controllers: [
    ExamController
  ],
  providers: [
    ExamService
  ]
})
export class ExamModule {}