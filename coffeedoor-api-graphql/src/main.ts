import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('HTTP_PORT');
  await app.listen(PORT);
  logger.log(`API GraphQL Gateway service is running on port ${PORT}`);
}
bootstrap();
