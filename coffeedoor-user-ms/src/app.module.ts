import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthCheckModule } from './health-check/health-check.module';
import { validate } from './utils/env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    HealthCheckModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
