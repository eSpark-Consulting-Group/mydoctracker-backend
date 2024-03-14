import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { UnknownExceptionFilter } from './utils/filters/UnknownExceptionFilter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new UnknownExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
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
  console.log(`⚡ Server running on port=${process.env.PORT} ⚡`);
  // console.log(`PORT=${process.env.PORT}`);
  // console.log(`MYSQL_HOST=${process.env.MYSQL_HOST}`);
  // console.log(`MYSQL_USER=${process.env.MYSQL_USER}`);
  // console.log(`MYSQL_PASSWORD=${process.env.MYSQL_PASSWORD}`);
  // console.log(`MYSQL_DATABASE=${process.env.MYSQL_DATABASE}`);
  // console.log(`MYSQL_PORT=${process.env.MYSQL_PORT}`);
  // console.log(`JWT_SECRET=${process.env.JWT_SECRET}`);
  // console.log(`JWT_EXPIRE=${process.env.JWT_EXPIRE}`);
  // console.log(`BUCKET_ID=${process.env.BUCKET_ID}`);
  // console.log(`API_KEY=${process.env.API_KEY}`);
  // console.log(`SENDGRID_SENDER_EMAIL=${process.env.SENDGRID_SENDER_EMAIL}`);
  // console.log(`SENDGRID_API_KEY=${process.env.SENDGRID_API_KEY}`);
  // console.log(`SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID=${process.env.SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID}`);
  // console.log(`B2_APPLICATION_KEY_ID=${process.env.B2_APPLICATION_KEY_ID}`);
  // console.log(`B2_APPLICATION_KEY=${process.env.B2_APPLICATION_KEY}`);
  // console.log(`ENDPOINT=${process.env.ENDPOINT}`);
  // console.log(`MONGODB_URI=${process.env.MONGODB_URI}`);
}
bootstrap();
