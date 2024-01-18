import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './utils/ValidationPipe/validation.pipe';
import { UnknownExceptionFilter } from './utils/filters/UnknownExceptionFilter.filter';
import * as device from 'express-device';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new UnknownExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(device.capture({ parseUserAgent: true }));
  const config = new DocumentBuilder()
    .setTitle('MyDocTracker APIs')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'key', in: 'header' }, 'key')
    .setDescription(
      'These are all the APIs used for the development of MyDocTracker',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(process.env.PORT);
  console.log(`App running on port ${process.env.PORT}`);
  console.log(
    'MONGODDB_URI=',
    process.env.MONGODB_URI,
    process.env.B2_APPLICATION_KEY,
  );
  console.log('MONGODDB_URI=', process.env);
}
bootstrap();
