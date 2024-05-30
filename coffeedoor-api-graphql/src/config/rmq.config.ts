import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const menuRmqConfig: ClientsProviderAsyncOptions = {
  name: 'MENU_RMQ_MS',
  useFactory: (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL')],
      queue: configService.get<string>('MENU_QUEUE_NAME'),
      queueOptions: {
        durable: false,
      },
    },
  }),
  inject: [ConfigService],
};

export const userRmqConfig: ClientsProviderAsyncOptions = {
  name: 'USER_RMQ_MS',
  useFactory: (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL')],
      queue: configService.get<string>('USER_QUEUE_NAME'),
      queueOptions: {
        durable: false,
      },
    },
  }),
  inject: [ConfigService],
};
