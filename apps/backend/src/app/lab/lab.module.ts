
import { Module } from '@nestjs/common';
import { LabController } from './lab.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LabSchema } from './lab.schema';
import { LabService } from './lab.service';
import { LabsController } from './labs.controller';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Lab', schema: LabSchema }])
  ],
  controllers: [
    LabController,
    LabsController
  ],
  providers: [
    LabService
  ],
})
export class LabModule {}