import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NotFoundExceptionFilter } from './app/filter/notfoundexception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  
  const globalPrefix = 'api';
  const port = process.env.PORT || 3001;
  
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useStaticAssets(join(__dirname, '..', '../../dist/apps/frontend/'));

  await app.listen(port, () => {
   console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
} 

bootstrap();