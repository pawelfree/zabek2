import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lab } from '../lab/lab.interface';
import { User } from '../user/user.interface';
import { CreateFeedbackDto } from './dto/feedback.create.dto';
import { Feedback } from './feedback.interface';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel('Feedback') private readonly feedbackModel: Model<Feedback>) {}

  async add(createDto: CreateFeedbackDto): Promise<Feedback> {
    return await new this.feedbackModel(createDto).save();
  }

  async findAllFeedbacks(
    pageSize: number = 10,
    currentPage: number = 0,
    lab: Lab = null
  ): Promise<{ feedbacks: Feedback[]; count: number }> {
    const options = {};
    if (lab) {
      options['lab'] = lab;
    }
    const findallQuery = this.feedbackModel.find<Feedback>(options);
    const count = await this.feedbackModel.countDocuments(findallQuery);
    return await findallQuery
      .skip(pageSize * currentPage)
      .limit(pageSize)
      .populate('lab')
      .then(feedbacks => ({ feedbacks, count }));
  }

}
