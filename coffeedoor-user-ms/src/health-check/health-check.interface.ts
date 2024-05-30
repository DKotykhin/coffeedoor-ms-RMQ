export enum HealthCheckEnum {
  SERVING = 'SERVING',
  NOT_SERVING = 'NOT_SERVING',
}

export interface HealthCheckResponse {
  status: HealthCheckEnum;
}
