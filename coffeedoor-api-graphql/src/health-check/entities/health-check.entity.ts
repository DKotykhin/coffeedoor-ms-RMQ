import { ObjectType, Field } from '@nestjs/graphql';
import { HealthCheckEnum } from '../health-check.interface';

@ObjectType()
export class HealthCheckStatus {
  @Field(() => HealthCheckEnum)
  status: HealthCheckEnum;
}

@ObjectType()
export class HealthCheck {
  @Field(() => HealthCheckStatus)
  menuRmqService: HealthCheckStatus;

  @Field(() => HealthCheckStatus)
  userRmqService: HealthCheckStatus;
}
