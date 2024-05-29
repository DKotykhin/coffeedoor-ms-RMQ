import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const RMQ_URL = configService.get<string>('RMQ_URL');

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [RMQ_URL],
      queue: 'menu-rmq-ms',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  logger.log(`Menu RMQ Microservice is running on ${RMQ_URL}`);
}
bootstrap();
