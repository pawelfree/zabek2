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
  
  function redirectToRoot(req, res, next) {
    res.redirect('/');
  };

  const globalPrefix = 'api';
  const port = process.env.PORT || 3001;
  

  const os = require("os");
    console.log(os.hostname());
  
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  app.useStaticAssets(join(__dirname, '..', '../../dist/apps/frontend/'), {fallthrough : true});
 // app.use(redirectToRoot);


  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
