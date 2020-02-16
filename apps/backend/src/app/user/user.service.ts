import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User, Role, Doctor } from '@zabek/data';
import { InjectModel } from '@nestjs/mongoose';
import { ResetPasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id).populate('lab').populate('doctor').select('-password -__v');
  }

  async findByDoctor(doctor: Doctor): Promise<User> {
    return await this.userModel.findOne({doctor})
  }

  async findByEmail(email: string, _id: string): Promise<User> {
    const obj = { email }
    if (_id) {
      obj['_id'] = { $ne: _id };
    }
    return await this.userModel.findOne(obj); 
  }

  findForRegistrationByEmail(email: string): Promise<User> {
    return this.userModel.findOne({email, rulesAccepted: false }).select('-password').then(async user => user ? await user.populate('doctor').execPopulate() : null );
  }

  async addDoctor(doctor: Doctor): Promise<User> {
    return await new this.userModel({...doctor, _id: new Types.ObjectId()}).save();
  }

  async addUser(user: User): Promise<User> {
    const newUser = new this.userModel({...user, _id: new Types.ObjectId()});
    return await newUser.save().then( async (savedUser) => await savedUser.populate('doctor').populate('lab').execPopulate());
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

  async update(updateUserDto: ResetPasswordDto | User)  {
    return await this.userModel.updateOne({_id: updateUserDto._id}, updateUserDto, {new : true});
  }

  async acceptRules(user: User) {
    return await this.userModel.findOneAndUpdate({_id: user._id},{$set: {rulesAccepted: true}}, {new: true});
  }

  async activate(user: User) {
    return await this.userModel.findOneAndUpdate({_id: user._id},{$set: {active: true}}, {new: true});
  }

  async setPassword(_id: string, password: string) {
    return await this.userModel.findOneAndUpdate({_id}, {$set: { password }}, {new: true});
  }
}
