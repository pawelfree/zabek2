import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Exam } from './exam.interface';
import { CreateExamDto } from './dto/createexam.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateExamDto } from './dto/updateexam.dto';

@Injectable()
export class ExamService {
  constructor(@InjectModel('Exam') private readonly examModel: Model<Exam>) {}

  async findById(id: string): Promise<Exam> {
    return await this.examModel.findById(id).select('-__v');
  }

  // TODO zmienic z name na na przykład patientFullName
  async findByName(name: string): Promise<Exam> {
    return await this.examModel.findOne({ name }).select('-__v');
  }

  async add(createDto: CreateExamDto): Promise<Exam> {
    return await new this.examModel(createDto).save();
  }

  async findAll(
    pageSize: number = 10,
    currentPage: number = 0
  ): Promise<{ exams: Exam[]; count: number }> {
    const findallQuery = this.examModel.find<Exam>();
    const count = await this.examModel.countDocuments(findallQuery);   
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).then(exams => ({ exams, count }) );
  }

  async update(updateExamDto: UpdateExamDto) {
    return await this.examModel.updateOne({_id: updateExamDto._id}, updateExamDto);
  }

  async delete(_id: string) {
    return await this.examModel.deleteOne({ _id });
  }
}
