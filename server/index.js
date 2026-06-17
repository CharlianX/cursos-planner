require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

let app;

module.exports = async (req, res) => {
  if (!app) {
    app = await NestFactory.create(AppModule, { logger: false });
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.init();
  }
  const instance = app.getHttpAdapter().getInstance();
  instance(req, res);
};
