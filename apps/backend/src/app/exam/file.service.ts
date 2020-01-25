import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileUpload } from './fileupload.interface';
import { CreateFileUploadDto } from './dto/fileupload.create.dto';

@Injectable()
export class FileService {
  
  constructor(@InjectModel('File') private readonly fileModel: Model<File>) {}

  async findAllFiles() {
    return await this.fileModel.find();
  }

  async add(createFileUploadDto: CreateFileUploadDto): Promise<FileUpload> {
    return await new this.fileModel(createFileUploadDto).save();
  }
}
