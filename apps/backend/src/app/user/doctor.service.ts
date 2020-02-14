import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Doctor, Role, User } from '@zabek/data';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DoctorService {
  constructor(@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
              @InjectModel('User') private readonly userModel: Model<User>) {}

  async addDoctor(doctor: Doctor): Promise<Doctor> {
    return await new this.doctorModel({...doctor, _id: new Types.ObjectId()}).save();
  }

  async findAllOnlineDoctors(pageSize: number, currentPage: number, labId: string): Promise<{ doctors: User[]; count: number }>  {
    const options = {role: Role.doctor };
    console.warn('dodac sadminowi lab');
    if (labId) {
      options['lab'] = labId;
    } 
    const findallQuery = this.userModel.find(options);
    const count = await this.userModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage)
                            .limit(pageSize)
                            .populate('doctor')
                            .then((doctors: User[]) => ({ doctors, count }) );
  }

  async findAllDoctors(pageSize: number, currentPage: number, labId: string): Promise<{ doctors: Doctor[]; count: number }>  {
    const findallQuery = this.doctorModel.find();
    const count = await this.doctorModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage)
                            .limit(pageSize)
                            .then((doctors: User[]) => ({ doctors, count }) );
  }

  async delete(_id: string) {
    return await this.doctorModel.deleteOne({ _id });
  }

  async update(doctor: Doctor)  {
    return await this.doctorModel.updateOne({_id: doctor._id}, doctor);
  }

  findByPwz(qualificationsNo: string): Promise<Doctor> {
    return this.doctorModel.findOne({qualificationsNo})
  }
  
}
