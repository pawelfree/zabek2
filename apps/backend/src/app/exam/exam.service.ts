import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Examination, Lab, User, FileUpload } from '@zabek/data';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateExamDto, CreateExamInternalDto } from './dto';

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

  // TODO zmienic z name na na przykład patientFullName
  async findByName(name: string): Promise<Examination> {
    return await this.examModel.findOne({ name }).select('-__v');
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

  // pobieranie badań dla wybranego lekarza
  async findAllExamsForDoctor(
    pageSize: number = 10,
    currentPage: number = 0,
    doctor: User
  ): Promise<{ exams: Examination[]; count: number }> {
    const options = {};

    options['doctor'] = doctor._id; //aktualny user id

    const findallQuery = this.examModel.find<Examination>(options);
    const count = await this.examModel.countDocuments(findallQuery);
    return await findallQuery
      .skip(pageSize * currentPage)
      .limit(pageSize)
      .populate('doctor')
      .populate('file')
      .then(exams => ({ exams, count }));
  }

  async update(updateExamDto: UpdateExamDto) {
    return await this.examModel.updateOne(
      { _id: updateExamDto._id },
      updateExamDto
    );
  }

  async delete(_id: string) {
    return await this.examModel.deleteOne({ _id });
  }

  async addFileToExam(_id: String, file: FileUpload) {
    return await this.examModel.findOneAndUpdate({ _id },{ $set: { file} },{ new: true });
  }
}
