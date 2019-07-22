
import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigService } from '../config/config.service';

@Module({
  providers: [...databaseProviders, ConfigService],
  exports: [...databaseProviders],
})
export class DatabaseModule {}