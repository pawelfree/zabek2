
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.interface';
import { Role } from './role';
import { UserPasswordDto } from './userpassword.dto';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  private users: User [] = [
    { _id: '1', username: 'admin', password: 'admin', role: Role.admin },
    { _id: '2', username: 'user', password: 'user', role: Role.user },
    { _id: '3', username: 'doctor', password: 'doctor', role: Role.doctor }
  ];

  async authenticate(userPasswordDto: UserPasswordDto) : Promise<User> {
  
    const user = this.users.find(x => x.username === userPasswordDto.username && x.password === userPasswordDto.password);
      return new Promise((resolve, reject) => {
      if (!user) {
        resolve(null);
      }
      else {
        resolve(user);
      }
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}