import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

import {
  HealthCheckEnum,
  HealthCheckResponse,
  HealthCheckStatus,
} from './health-check.interface';

@Injectable()
export class HealthCheckService {
  constructor(
    @Inject('MENU_RMQ_MS') private readonly menuRMQClient: ClientProxy,
    @Inject('USER_RMQ_MS') private readonly userRMQClient: ClientProxy,
  ) {}
  protected readonly logger = new Logger(HealthCheckService.name);

  async checkHealth(): Promise<HealthCheckResponse> {
    const checkServiceHealth = async (client: ClientProxy, service: string) => {
      try {
        return await firstValueFrom(
          client
            .send<HealthCheckStatus, any>(`${service}-health-check`, {})
            .pipe(timeout(3000)),
        );
      } catch (error) {
        this.logger.error(
          `Health check catch code ${error.code || 500} - ${error.message}`,
        );
        return { status: HealthCheckEnum.NOT_SERVING };
      }
    };

    const [menuRmqService, userRmqService] = await Promise.all([
      checkServiceHealth(this.menuRMQClient, 'menu'),
      checkServiceHealth(this.userRMQClient, 'user'),
    ]);

    return {
      menuRmqService,
      userRmqService,
    };
  }
}
