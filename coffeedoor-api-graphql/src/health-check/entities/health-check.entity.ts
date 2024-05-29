import { ObjectType, Field } from '@nestjs/graphql';
import { HealthCheckEnum } from '../health-check.interface';

@ObjectType()
export class HealthCheck {
  @Field(() => HealthCheckEnum)
  status: HealthCheckEnum;
}
