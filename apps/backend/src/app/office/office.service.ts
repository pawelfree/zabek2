import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Office } from './office.interface';
import { CreateOfficeDto } from './dto/createoffice.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OfficeService {
  constructor(@InjectModel('Office') private readonly officeModel: Model<Office>) {}

  async findById(id: string): Promise<Office> {
    return await this.officeModel.findById(id).select('-__v');
  }

  async add(createDto: CreateOfficeDto): Promise<Office> {
    return await new this.officeModel(createDto).save();
  }

  async findAll(
    pageSize: number,
    currentPage: number
  ): Promise<{ users: Office[]; count: number }> {
    let offices;
    const findallQuery = this.officeModel.find();
    if (pageSize && currentPage) {
      findallQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    return await findallQuery
      .then(documents => {
        offices = documents;
        return this.officeModel.countDocuments();
      })
      .then(count => {
        return {
          offices,
          count
        };
      });
  }

  async delete(_id: string) {
    return await this.officeModel.deleteOne({ _id });
  }
}
