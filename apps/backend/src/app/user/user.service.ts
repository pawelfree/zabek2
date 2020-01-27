import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IUser, Role } from '@zabek/data';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserInternalDto, CreateUserInternalDto, CreateDoctorDto, ResetPasswordDto, UpdateDoctorDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async findById(id: string): Promise<IUser> {
    return await this.userModel.findById(id).populate('lab').select('-password -__v');
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email }); //TODO: ale teraz mogą być userzy z pustym emailem - lekarze....
  }

  async addDoctor(createDoctorDto: CreateDoctorDto): Promise<IUser> {
    return await new this.userModel({...createDoctorDto, _id: new Types.ObjectId()}).save();
  }

  async addUser(createUserInternalDto: CreateUserInternalDto): Promise<IUser> {
    return await new this.userModel(createUserInternalDto).save();
  }

  async findAllDoctors(pageSize: number, currentPage: number, labId: string): Promise<{ doctors: IUser[]; count: number }>  {
    const options = {role: Role.doctor };
    console.warn('dodac sadminowi lab');
    if (labId) {
      options['lab'] = labId;
    } 
    const findallQuery = this.userModel.find(options);
    const count = await this.userModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).then(doctors => ({ doctors, count }) );
  }

  async findAllUsers( pageSize: number, currentPage: number, labId: string): Promise<{ users: IUser[]; count: number }> {
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

  async update(updateUserDto: UpdateUserInternalDto | ResetPasswordDto | UpdateDoctorDto)  {
    return await this.userModel.updateOne({_id: updateUserDto._id}, updateUserDto);
  }
}
