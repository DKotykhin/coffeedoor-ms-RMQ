import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { HealthCheckModule } from './health-check/health-check.module';
import { validate } from './utils/env.validator';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error: any) => {
        const originalError = error.extensions?.originalError;
        if (!originalError) {
          return {
            message: error?.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError.message,
          error: originalError.error,
          code: originalError.statusCode,
        };
      },
    }),
    HealthCheckModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
