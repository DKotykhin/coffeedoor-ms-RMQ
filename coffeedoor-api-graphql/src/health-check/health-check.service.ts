import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { HealthCheckResponse } from './health-check.interface';

@Injectable()
export class HealthCheckService {
  constructor(@Inject('MENU_RMQ_MS') private readonly client: ClientProxy) {}
  protected readonly logger = new Logger(HealthCheckService.name);

  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await firstValueFrom(
        this.client.send<HealthCheckResponse, string>('menu-health-check', ''),
      );
      return response;
    } catch (error) {
      this.logger.error(`${error.code} - ${error.message}`);
      throw new HttpException(
        error.message,
        error.code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
