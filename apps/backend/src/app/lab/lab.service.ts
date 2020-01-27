import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Lab } from '@zabek/data';
import { CreateLabDto, UpdateLabDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LabService {
  
  constructor(@InjectModel('Lab') private readonly labModel: Model<Lab>) {}

  async findById(id: string): Promise<Lab> {
    return await this.labModel.findById(id).select('-__v');
  }

  async findByName(name: string): Promise<Lab> {
    return await this.labModel.findOne({ name }).select('-__v');
  }

  async add(createDto: CreateLabDto): Promise<Lab> {
    return await new this.labModel(createDto).save();
  }

  async incrementUsers(_id: string) {
    return await this.labModel.findOneAndUpdate({_id}, { $inc: {usersCount: 1}});
  }

  async decrementUsers(_id: string) {
    return await this.labModel.findOneAndUpdate({_id}, { $inc: {usersCount: -1}});
  }

  async findAll(pageSize: number = 10, currentPage: number = 0): Promise<{ labs: Lab[]; count: number }> {
    const findallQuery = this.labModel.find<Lab>();
    const count = await this.labModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).then(labs => ({ labs, count }) );
  }

  async update(updateLabDto: UpdateLabDto) {
    return await this.labModel.updateOne({_id: updateLabDto._id}, updateLabDto);
  }

  delete(_id: string) {
    return this.labModel.findOneAndRemove( {_id, usersCount: 0 } );
  }
}
