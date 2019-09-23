import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Lab } from './lab.interface';
import { CreateLabDto } from './dto/createlab.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateLabDto } from './dto/updatelab.dto';

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

  async findAll(
    pageSize: number = 10,
    currentPage: number = 0
  ): Promise<{ labs: Lab[]; count: number }> {
    const findallQuery = this.labModel.find<Lab>();
    const count = await this.labModel.countDocuments(findallQuery);
    return await findallQuery.skip(pageSize * currentPage).limit(pageSize).then(labs => ({ labs, count }) );
  }

  async update(updateLabDto: UpdateLabDto) {
    return await this.labModel.updateOne({_id: updateLabDto._id}, updateLabDto);
  }

  async delete(_id: string) {
    return await this.labModel.findByIdAndRemove( _id );
  }
}
