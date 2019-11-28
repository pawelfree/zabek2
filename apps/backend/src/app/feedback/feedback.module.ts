
import { Module } from '@nestjs/common';
//import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';


@Module({
  imports: [ 
    
  ],
  controllers: [
    FeedbackController    
  ],
  providers: [
    FeedbackService
  ]
})
export class FeedbackModule {}