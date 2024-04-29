import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multiPart from '@fastify/multipart';
import { ConfigApp } from './config/config';

async function bootstrap() {
  const port = process.env.APP_PORT || 5000;
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      bodyLimit: Number.MAX_VALUE,
    }),
  );

  await app.register(multiPart);
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // transform: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();
  // await app.listen(port);
  await app.listen(ConfigApp.appPort, '0.0.0.0');
  console.log(`Server running on port: ${port}`);
}
bootstrap();
