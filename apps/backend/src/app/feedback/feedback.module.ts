
import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controler';
import { FeedbackSchema } from './feedback.schema';
import { EmailService } from '../shared/email/email.service';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Feedback', schema: FeedbackSchema }]),
    HttpModule  
  ],
  controllers: [
    FeedbackController    
  ],
  providers: [
    FeedbackService,
    EmailService
  ]
})
export class FeedbackModule {}