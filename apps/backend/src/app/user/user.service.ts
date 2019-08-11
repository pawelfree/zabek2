import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/createuser.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).select('-password -__v');
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async add(createUserDto: CreateUserDto): Promise<User> {
    return await new this.userModel(createUserDto).save();
  }

  async findAll(
    pageSize: number,
    currentPage: number
  ): Promise<{ users: User[]; count: number }> {
    let fetchedUsers;
    const findallQuery = this.userModel.find();
    if (pageSize && currentPage) {
      findallQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    return await findallQuery
      .then(documents => {
        fetchedUsers = documents;
        return this.userModel.countDocuments();
      })
      .then(count => {
        return {
          users: fetchedUsers,
          count: count
        };
      });
  }

  async delete(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}
