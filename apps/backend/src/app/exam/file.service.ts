import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileUpload } from '@zabek/data';

@Injectable()
export class FileService {
  
  constructor(@InjectModel('File') private readonly fileModel: Model<File>) {}

  async findAllFiles() {
    return await this.fileModel.find();
  }

  async add(fileUpload: FileUpload): Promise<FileUpload> {
    return await new this.fileModel({...fileUpload, _id: new Types.ObjectId()}).save();
  }
}
