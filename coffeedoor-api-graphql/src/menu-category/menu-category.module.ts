import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { menuRmqConfig, userRmqConfig } from '../config/rmq.config';

import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryResolver } from './menu-category.resolver';
import { AllMenuResolver } from './all-menu.resolver';

@Module({
  imports: [ClientsModule.registerAsync([menuRmqConfig, userRmqConfig])],
  providers: [AllMenuResolver, MenuCategoryResolver, MenuCategoryService],
})
export class MenuCategoryModule {}
