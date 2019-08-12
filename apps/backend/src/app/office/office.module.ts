
import { Module } from '@nestjs/common';
import { OfficeController } from './office.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OfficeSchema } from './office.schema';
import { OfficeService } from './office.service';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Office', schema: OfficeSchema }])
  ],
  controllers: [
    OfficeController
  ],
  providers: [
    OfficeService
  ],
})
export class OfficeModule {}