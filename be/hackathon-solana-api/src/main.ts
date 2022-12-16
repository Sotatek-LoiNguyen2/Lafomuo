import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import responseTime from 'response-time';

import { AppModule } from './app.module';
import { HEADER_KEY } from './auth/constants/strategy.constant';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { RequestIdMiddleware } from './shared/middleware/request-id/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(
    responseTime({
      header: 'x-response-time',
    }),
  );

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Stream2Earn API')
    .setDescription('Stream2Earn API')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .addApiKey(
      {
        name: HEADER_KEY.API_KEY,
        in: 'header',
        type: 'apiKey',
      },
      HEADER_KEY.API_KEY,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  await app.listen(port);
  console.log('The app run at port ' + port);
}
bootstrap();
