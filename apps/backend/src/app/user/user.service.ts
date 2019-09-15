import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserInternalDto, CreateUserInternalDto, CreateDoctorDto } from './dto';

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

  async findAll(
    pageSize: number,
    currentPage: number
  ): Promise<{ users: User[]; count: number }> {
    let users;
    const findallQuery = this.userModel.find().populate('lab', 'name');
    if (pageSize && currentPage) {
      findallQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    return await findallQuery
      .then(documents => {
        users = documents;
        return this.userModel.countDocuments();
      })
      .then(count => {
        return {
          users,
          count
        };
      });
  }

  async delete(_id: string) {
    return await this.userModel.deleteOne({ _id });
  }

  async update(updateUserDto: UpdateUserInternalDto) {
    return await this.userModel.updateOne({_id: updateUserDto._id}, updateUserDto);
  }
}
