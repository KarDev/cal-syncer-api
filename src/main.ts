import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000);

  logger.log(`Application is running on ${await app.getUrl()}`);
}

bootstrap().then((r) => logger.log('Application started'));
