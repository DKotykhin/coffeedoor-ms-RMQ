import { Query, Resolver } from '@nestjs/graphql';

import { HealthCheckService } from './health-check.service';
import { HealthCheck } from './entities/health-check.entity';
import { HealthCheckResponse } from './health-check.interface';

@Resolver()
export class HealthCheckResolver {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Query(() => HealthCheck)
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.healthCheckService.checkHealth();
  }
}
