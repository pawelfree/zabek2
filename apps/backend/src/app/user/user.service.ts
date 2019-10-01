import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserInternalDto, CreateUserInternalDto, CreateDoctorDto, ResetPasswordDto } from './dto';
import { Role } from '../shared/role';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).populate('lab').select('-password -__v');
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async addDoctor(createDoctorDto: CreateDoctorDto): Promise<User> {
    return await new this.userModel(createDoctorDto).save();
  }

  async addUser(createUserInternalDto: CreateUserInternalDto): Promise<User> {
    return await new this.userModel(createUserInternalDto).save();
  }

  async findAllDoctors(pageSize: number, currentPage: number, labId: string): Promise<{ doctors: User[]; count: number }>  {
    const options = {role: Role.doctor };
    console.warn('dodac sadminowi lab');
    if (labId) {
      options['lab'] = labId;
    } 
    const findallQuery = this.userModel.find(options);
    const count = await this.userModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).then(doctors => ({ doctors, count }) );
  }
// TODO to się oczywiście inaczej musi nazywac
  async findReallyAllDoctors(): Promise<{ doctors: User[] }>  {
    const options = {role: Role.doctor };
    const findallQuery = this.userModel.find(options);    
    return await findallQuery.then(doctors => ({ doctors}) );
  }



  async findAllUsers( pageSize: number, currentPage: number, labId: string): Promise<{ users: User[]; count: number }> {
    const options = {role: { $in: [Role.admin, Role.user]}};
    console.warn('dodac sadminowi lab');
    if (labId) {
      options['lab'] = labId;
    } 
    const findallQuery = this.userModel.find(options);
    const count = await this.userModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).populate('lab', 'name').then(users => ({ users, count }) );
  }

  async delete(_id: string) {
    return await this.userModel.deleteOne({ _id });
  }

  async update(updateUserDto: UpdateUserInternalDto | ResetPasswordDto)  {
    return await this.userModel.updateOne({_id: updateUserDto._id}, updateUserDto);
  }
}
