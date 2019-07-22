/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  const globalPrefix = 'api';
  const port = process.env.port || 3333;

  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(join(__dirname, '..', './dist/apps/frontend'));
  app.enableCors();

  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
