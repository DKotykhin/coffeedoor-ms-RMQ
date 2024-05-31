import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthCheckModule } from './health-check/health-check.module';
import { validate } from './utils/env.validator';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PasswordHashModule } from './password-hash/password-hash.module';
import { MailSenderModule } from './mail-sender/mail-sender.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    AuthModule,
    DatabaseModule,
    HealthCheckModule,
    MailSenderModule,
    PasswordHashModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
