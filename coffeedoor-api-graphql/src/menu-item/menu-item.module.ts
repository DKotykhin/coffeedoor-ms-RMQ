import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import { menuRmqConfig } from '../config/rmq.config';

import { MenuItemService } from './menu-item.service';
import { MenuItemResolver } from './menu-item.resolver';

@Module({
  imports: [ClientsModule.registerAsync([menuRmqConfig])],
  providers: [MenuItemResolver, MenuItemService],
})
export class MenuItemModule {}
