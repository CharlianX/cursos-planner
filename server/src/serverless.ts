import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

let app: INestApplication;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.init();
  }
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
}
