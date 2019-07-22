
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.interface';
import { CreateUserDto } from './dto/createuser.dto';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findById(id: string) : Promise<User> {
    return await this.userModel.findById(id).select('-password -__v');
  }
  
  async findByEmail(email: string) : Promise<User> {
    return await this.userModel.findOne({email: email});
  }

  async add(createUserDto: CreateUserDto) : Promise<User> {
    return (new this.userModel(createUserDto)).save().select('-password -__v');
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().select('-password -__v');
  }

  async delete(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
}