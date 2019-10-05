import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Exam } from './exam.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateExamDto, CreateExamInternalDto } from './dto';
import { Lab } from '../lab/lab.interface';

@Injectable()
export class ExamService {
  constructor(@InjectModel('Exam') private readonly examModel: Model<Exam>) {}

  async findById(id: string): Promise<Exam> {
    return await this.examModel.findById(id).populate('doctor').select('-__v');
  }

  // TODO zmienic z name na na przykład patientFullName
  async findByName(name: string): Promise<Exam> {
    return await this.examModel.findOne({ name }).select('-__v');
  }

  async add(createDto: CreateExamInternalDto): Promise<Exam> {
    return await new this.examModel(createDto).save();
  }

  async findAllExams(
    pageSize: number = 10,
    currentPage: number = 0,
    lab: Lab = null
  ): Promise<{ exams: Exam[]; count: number }> {
    const options = {};
    //TODO dodac sadminowi lab
    console.warn('dodac sadminowi lab');
    if (lab) {
      options['lab'] = lab;
    } 
    const findallQuery = this.examModel.find<Exam>(options);
    const count = await this.examModel.countDocuments(findallQuery);   
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).populate('doctor').then(exams => ({ exams, count }) );
  }

  async update(updateExamDto: UpdateExamDto) {
    return await this.examModel.updateOne({_id: updateExamDto._id}, updateExamDto);
  }

  async delete(_id: string) {
    return await this.examModel.deleteOne({ _id });
  }
}
