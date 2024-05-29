import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const menuRmqConfig: ClientsProviderAsyncOptions = {
  name: 'MENU_RMQ_MS',
  useFactory: (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL')],
      queue: 'menu-rmq-ms',
      queueOptions: {
        durable: false,
      },
    },
  }),
  inject: [ConfigService],
};
