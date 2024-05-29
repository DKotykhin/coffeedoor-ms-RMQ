import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { menuRmqConfig } from '../config/rmq.config';
import { HealthCheckService } from './health-check.service';
import { HealthCheckResolver } from './health-check.resolver';

@Module({
  imports: [ClientsModule.registerAsync([menuRmqConfig])],
  providers: [HealthCheckResolver, HealthCheckService],
})
export class HealthCheckModule {}
