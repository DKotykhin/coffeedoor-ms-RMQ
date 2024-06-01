import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const logger = new Logger('main.ts');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const RMQ_URL = configService.get<string>('RMQ_URL');
  const QUEUE_NAME = configService.get<string>('MENU_QUEUE_NAME');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RMQ_URL],
        queue: QUEUE_NAME,
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
  logger.log(`Menu RMQ Microservice is running on ${RMQ_URL}`);
}
bootstrap();
