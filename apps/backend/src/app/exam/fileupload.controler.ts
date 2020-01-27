import { Controller, Get, UseGuards, Request, Post, Body } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import S3 from 'aws-sdk/clients/s3';
import uuid from 'uuid';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { Role } from '@zabek/data';
import { FileService } from './file.service';
import { CreateFileUploadDto } from './dto/fileupload.create.dto';

@Controller('files')
export class FileuploadControler {

  private s3;

  constructor(
    private readonly config: ConfigService,
    private readonly fileService: FileService) {

    this.s3 = new S3({
      accessKeyId: this.config.get('ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('SECRET_API_KEY'),
      signatureVersion: 'v4',
      region: 'eu-central-1',
      apiVersion: '2006-03-01'
    });

  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.user)
  @Get('/fileupload')
  getPresignedFileUrl(
    @Request() req
  ) {
    const key = `${req.user.lab}/${uuid()}`
    console.log('getpresigned', key);
    const params = { Bucket: 'rtgcloud-pawel.f.dudek', Key : key};
    return this.s3.getSignedUrlPromise('putObject', params).then(
      url => ({url, key})
    )
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.user, Role.admin, Role.sadmin)
  @Get()
  getAllFiles() {
    return this.fileService.findAllFiles();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','user')
  @Post()
  async addFileUpload(@Body() createFileUploadDto: CreateFileUploadDto)  {
    return await this.fileService.add(createFileUploadDto);
  }

}
