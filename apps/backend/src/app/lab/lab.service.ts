import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Lab } from './lab.interface';
import { CreateLabDto } from './dto/createlab.dto';
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

  async findAll(
    pageSize: number,
    currentPage: number
  ): Promise<{ labs: Lab[]; count: number }> {
    let labs;
    const findallQuery = this.labModel.find();
    if (pageSize && currentPage) {
      findallQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    return await findallQuery
      .then(documents => {
        labs = documents;
        return this.labModel.countDocuments();
      })
      .then(count => {
        return {
          labs,
          count
        };
      });
  }

  async delete(_id: string) {
    return await this.labModel.deleteOne({ _id });
  }
}
