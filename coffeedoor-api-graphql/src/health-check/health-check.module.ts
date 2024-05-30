import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { menuRmqConfig, userRmqConfig } from '../config/rmq.config';
import { HealthCheckService } from './health-check.service';
import { HealthCheckResolver } from './health-check.resolver';

@Module({
  imports: [ClientsModule.registerAsync([menuRmqConfig, userRmqConfig])],
  providers: [HealthCheckResolver, HealthCheckService],
})
export class HealthCheckModule {}
