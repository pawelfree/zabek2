
import { Module } from '@nestjs/common';
import { LabController } from './lab.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LabSchema } from '@zabek/data';
import { LabService } from './lab.service';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Lab', schema: LabSchema }])
  ],
  controllers: [
    LabController
  ],
  providers: [
    LabService
  ],
})
export class LabModule {}