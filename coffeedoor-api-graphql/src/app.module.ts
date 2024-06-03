import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';

import { validate } from './utils/env.validator';
import { HealthCheckModule } from './health-check/health-check.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { MenuItemModule } from './menu-item/menu-item.module';

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
      context: ({ req, res }) => ({ req, res }),
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
    CacheModule.register({
      isGlobal: true,
      ttl: 10 * 1000,
    }),
    AuthModule,
    HealthCheckModule,
    MenuCategoryModule,
    MenuItemModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
