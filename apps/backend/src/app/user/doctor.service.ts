import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Doctor, Role, User } from '@zabek/data';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DoctorService {
  constructor(@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
              @InjectModel('User') private readonly userModel: Model<User>) {}

  // async findById(id: string): Promise<User> {
  //   return await this.userModel.findById(id).populate('lab').select('-password -__v');
  // }

  // async findByEmail(email: string): Promise<User> {
  //   return await this.userModel.findOne({ email }); //TODO: ale teraz mogą być userzy z pustym emailem - lekarze....
  // }

  // async addDoctor(doctorCreateDto: DoctorCreateDto): Promise<Doctor> {
  //   return await new this.doctorModel({...doctorCreateDto, _id: new Types.ObjectId()}).save();
  // }

  // async addUser(userCreateDto: UserCreateDto): Promise<User> {
  //   return await new this.userModel({...userCreateDto, _id: new Types.ObjectId()}).save();
  // }

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

  // async delete(_id: string) {
  //   return await this.userModel.deleteOne({ _id });
  // }

  // async update(updateUserDto: ResetPasswordDto | DoctorUpdateDto | UserUpdateDto)  {
  //   return await this.userModel.updateOne({_id: updateUserDto._id}, updateUserDto);
  // }
}
