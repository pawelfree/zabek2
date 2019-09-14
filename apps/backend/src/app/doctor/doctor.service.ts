import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Doctor } from './doctor.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDoctorDto } from './dto';

@Injectable()
export class DoctorService {
  constructor(@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>) {}

//   async findById(id: string): Promise<User> {
//     return await this.userModel.findById(id).populate('lab').select('-password -__v');
//   }

  async findByEmail(email: string): Promise<Doctor> {
    return await this.doctorModel.findOne({ email });
  }

  async add(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await new this.doctorModel(createDoctorDto).save();
  }

//   async findAll(
//     pageSize: number,
//     currentPage: number
//   ): Promise<{ users: User[]; count: number }> {
//     let users;
//     const findallQuery = this.userModel.find().populate('lab', 'name');
//     if (pageSize && currentPage) {
//       findallQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//     }
//     return await findallQuery
//       .then(documents => {
//         users = documents;
//         return this.userModel.countDocuments();
//       })
//       .then(count => {
//         return {
//           users,
//           count
//         };
//       });
//   }

//   async delete(_id: string) {
//     return await this.userModel.deleteOne({ _id });
//   }

//   async update(updateUserDto: UpdateUserInternalDto) {
//     return await this.userModel.updateOne({_id: updateUserDto._id}, updateUserDto);
//   }
}
