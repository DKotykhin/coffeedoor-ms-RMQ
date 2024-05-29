import { registerEnumType } from '@nestjs/graphql';

export enum HealthCheckEnum {
  SERVING = 'SERVING',
  NOT_SERVING = 'NOT_SERVING',
}
registerEnumType(HealthCheckEnum, {
  name: 'HealthCheckEnum',
});

export interface HealthCheckResponse {
  status: HealthCheckEnum;
}
