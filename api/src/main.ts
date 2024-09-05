import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { NotebookModule } from './notebook/notebook.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';


async function bootstrap() {
  const app = await NestFactory.create(NotebookModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  dotenv.config();
  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:4200', 
      'http://localhost:4300', 
      process.env.DOMAIN
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Se necessario per autenticazione con cookie o token
  };
  
  app.enableCors(corsOptions);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();