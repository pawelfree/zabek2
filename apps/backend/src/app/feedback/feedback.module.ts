
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controler';
import { FeedbackSchema } from './feedback.schema';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Feedback', schema: FeedbackSchema }])    
  ],
  controllers: [
    FeedbackController    
  ],
  providers: [
    FeedbackService
  ]
})
export class FeedbackModule {}