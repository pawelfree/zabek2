import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Exam } from './exam.interface';
import { CreateExamDto } from './dto/createexam.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateExamDto } from './dto/updateexam.dto';

@Injectable()
export class ExamService {
  /* private  DATA = [
    {
      id: '101',
      examinationDate: '2019-02-03',
      patientFullName: 'Jan Kowalski',
      examinationType: 'Wewnątrzustne',
      patientPesel: '11223312345',
      patientAge: '666',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: '001-1',
      doctorOfficeName: 'PTAK1',
      patientAck: 'Tak',
      examinationFile: 'https://pl.wikipedia.org/wiki/Z%C4%99by_cz%C5%82owieka#/media/Plik:06-10-06smile.jpg'
    },
    {
      id: '102',
      examinationDate: '2019-02-12',
      patientFullName: 'Anna Kowalska',
      examinationType: 'Pantomograficzne PX',
      patientPesel: '11223312345',
      patientAge: '15',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: 'AAA-21',
      doctorOfficeName: 'PTAK1',
      patientAck: 'Nie',
      examinationFile: ''
    },
    {
      id: '103',
      examinationDate: '2019-02-25',
      patientFullName: 'Marcin Nowak',
      examinationType: 'Mikro CBCT',
      patientPesel: '11223312345',
      patientAge: '45',
      doctorFullName: 'Eustachy Gwidoń',
      doctorQualificationsNo: '231-1',
      doctorOfficeName: 'GWID',
      patientAck: 'Tak',
      examinationFile: ''
    },
    {
      id: '104',
      examinationDate: '2019-03-15',
      patientFullName: 'Mikołaj Burza',
      examinationType: 'Wewnątrzustne',
      patientPesel: '11223312345',
      patientAge: '32',
      doctorFullName: 'Janina Białas',
      doctorQualificationsNo: 'DF1-5',
      doctorOfficeName: 'WHITE',
      patientAck: 'N/A',
      examinationFile: ''
    },
    {
      id: '105',
      examinationDate: '2019-03-26',
      patientFullName: 'Jan Kowalski',
      examinationType: 'CBCT całkowite',
      patientPesel: '11223312345',
      patientAge: '23',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: 'H81-1',
      doctorOfficeName: 'PTAK1',
      patientAck: 'Tak',
      examinationFile: 'https://pl.wikipedia.org/wiki/Z%C4%99by_cz%C5%82owieka#/media/Plik:06-10-06smile.jpg'
    },
    {
      id: '106',
      examinationDate: '2019-04-11',
      patientFullName: 'Patrycja Sosna',
      examinationType: 'CBCT całkowite',
      patientPesel: '11223312345',
      patientAge: '15',
      doctorFullName: 'Eustachy Gwidoń',
      doctorQualificationsNo: 'ZZ1-C',
      doctorOfficeName: 'GWID-BIS',
      patientAck: 'Nie',
      examinationFile: ''
    },
    {
      id: '107',
      examinationDate: '2019-04-17',
      patientFullName: 'Marcin Nowak',
      examinationType: 'Wewnątrzustne',
      patientPesel: '11223312345',
      patientAge: '45',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: 'KO1-1',
      doctorOfficeName: 'PTAK1',
      patientAck: 'Tak',
      examinationFile: ''
    },
    {
      id: '108',
      examinationDate: '2019-04-25',
      patientFullName: 'Jan Kowalski',
      examinationType: 'Pantomograficzne pozostałe',
      patientPesel: '11223312345',
      patientAge: '23',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: 'F01-A',
      doctorOfficeName: 'PTAK2',
      patientAck: 'Tak',
      examinationFile: ''
    },
    {
      id: '109',
      examinationDate: '2019-05-02',
      patientFullName: 'Marcin Nowak',
      examinationType: 'CBCT całkowite',
      patientPesel: '11223312345',
      patientAge: '45',
      doctorFullName: 'Janina Białas',
      doctorQualificationsNo: 'J72-2',
      doctorOfficeName: 'WHITE',
      patientAck: 'Tak',
      examinationFile: ''
    },
    {
      id: '110',
      examinationDate: '2019-05-08',
      patientFullName: 'Jan Kowalski',
      examinationType: 'Wewnątrzustne',
      patientPesel: '11223312345',
      patientAge: '23',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: 'A32-9',
      doctorOfficeName: 'PTAK2',
      patientAck: 'Tak',
      examinationFile: ''
    },
    {
      id: '111',
      examinationDate: '2019-05-10',
      patientFullName: 'Mikołaj Burza',
      examinationType: 'CBCT sektorowe',
      patientPesel: '11223312345',
      patientAge: '32',
      doctorFullName: 'Janina Białas',
      doctorQualificationsNo: '653-1',
      doctorOfficeName: 'WHITE',
      patientAck: 'N/A',
      examinationFile: ''
    },
    {
      id: '112',
      examinationDate: '2019-05-12',
      patientFullName: 'Jan Kowalski',
      examinationType: 'Cefalometryczne',
      patientPesel: '11223312345',
      patientAge: '23',
      doctorFullName: 'Cezary Ptak',
      doctorQualificationsNo: '231-X',
      doctorOfficeName: 'PTAK2',
      patientAck: 'Tak',
      examinationFile: ''
    }
  ]; */

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
    pageSize: number,
    currentPage: number
  ): Promise<{ exams: Exam[]; count: number }> {
    let exams;
    const findallQuery = this.examModel.find<Exam>();
    if (pageSize && currentPage) {
      findallQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    return await findallQuery
      .then(documents => {
        exams = documents;
        return this.examModel.countDocuments();
      })
      .then(count => {
        return {
          exams,
          count
        };
      });
  }

  async update(updateExamDto: UpdateExamDto) {
    return await this.examModel.updateOne({_id: updateExamDto._id}, updateExamDto);
  }

  async delete(_id: string) {
    return await this.examModel.deleteOne({ _id });
  }
}
