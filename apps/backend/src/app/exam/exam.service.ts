import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Examination, Lab, FileUpload, Doctor } from '@zabek/data';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExamInternalDto } from './dto';

@Injectable()
export class ExamService {
  constructor(@InjectModel('Exam') private readonly examModel: Model<Examination>) {}

  async findById(id: string): Promise<Examination> {
    return await this.examModel
      .findById(id)
      .populate('doctor')
      .populate('lab')
      .populate('file')
      .select('-__v');
  }

  async add(createDto: CreateExamInternalDto): Promise<Examination> {
    return await new this.examModel(createDto).save();
  }

  async findAllExams(
    pageSize: number = 10,
    currentPage: number = 0,
    lab: Lab = null
  ): Promise<{ exams: Examination[]; count: number }> {
    const options = {};
    if (lab) {
      options['lab'] = lab;
    }
    const findallQuery = this.examModel.find<Examination>(options);
    const count = await this.examModel.countDocuments(findallQuery);
    return await findallQuery
      .skip(pageSize * currentPage)
      .limit(pageSize)
      .populate('doctor')
      .populate('file')
      .then(exams => ({ exams, count })); 
  }

  async findAllExamsForDoctor(
    pageSize: number = 10,
    currentPage: number = 0,
    doctor: Doctor
  ): Promise<{ exams: Examination[]; count: number }> {
    const options = {};

    options['doctor'] = doctor._id;
    options['file'] = { $ne : null };

    const findallQuery = this.examModel.find<Examination>(options);
    const count = await this.examModel.countDocuments(findallQuery);
    return await findallQuery
      .skip(pageSize * currentPage)
      .limit(pageSize)
      .populate('doctor')
      .populate('file')
      .then(exams => ({ exams, count }));
  }

  async update(exam: Examination) {
    return await this.examModel.updateOne(
      { _id: exam._id },
      exam
    );
  }

  async delete(_id: string) {
    return await this.examModel.deleteOne({ _id });
  }

  async addFileToExam(_id: String, file: FileUpload) {
    return await this.examModel.findOneAndUpdate({ _id },{ $set: {file} },{ new: true });
  }

  async registerSentNotification(_id: String) {
    return await this.examModel.findOneAndUpdate({_id}, {$set: {lastNotificationDate: new Date()}, $inc: {notificationSent: 1 } }, {new: true});
  }
}
