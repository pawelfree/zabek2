import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SecurityModule } from './shared/security/security.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LabModule } from './lab/lab.module';
import { ExamModule } from './exam/exam.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ 
    SecurityModule,
    AuthModule,
    LabModule,
    ExamModule,
    UserModule,
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', '../../dist/apps/frontend/')
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      }),
      inject: [ConfigService],
    })
   ],
  exports: [ MongooseModule ]
})
export class AppModule {}
