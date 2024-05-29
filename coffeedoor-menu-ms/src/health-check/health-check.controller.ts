import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { HealthCheckEnum, HealthCheckResponse } from './health-check.interface';

@Controller()
export class HealthCheckController {
  protected readonly logger = new Logger(HealthCheckController.name);

  @MessagePattern('menu-health-check')
  check(): HealthCheckResponse {
    this.logger.log('Menu health check request received');
    return { status: HealthCheckEnum.SERVING };
  }
}
