import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './utils/env.validator';
import { DatabaseModule } from './database/database.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { MenuItemModule } from './menu-item/menu-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    DatabaseModule,
    HealthCheckModule,
    MenuCategoryModule,
    MenuItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
