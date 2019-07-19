
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/createuser.dto';


@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async findById(id: string) : Promise<User> {
    return await this.userModel.findById(id, '-password -__v');
  }
  
  async findByEmail(email: string) : Promise<User> {
    return await this.userModel.findOne({email: email});
  }

  async add(createUserDto: CreateUserDto) : Promise<User> {
    return (new this.userModel(createUserDto)).save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async delete(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}