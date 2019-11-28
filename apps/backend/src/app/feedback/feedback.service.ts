import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lab } from '../lab/lab.interface';
import { User } from '../user/user.interface';

@Injectable()
export class FeedbackService {
  constructor() {}

  
  async sendFeedback(feedback: string) {
    return await this.examModel.deleteOne({ _id });
  }
}
