import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  ChangePositionDto,
  StatusResponseDto,
} from '../menu-category/dto/_index';

import { MenuItemService } from './menu-item.service';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}
  protected readonly logger = new Logger(MenuItemController.name);

  @MessagePattern('get-menu-items-by-category-id')
  async getMenuItemsByCategoryId({ id }: { id: string }): Promise<MenuItem[]> {
    this.logger.log('Received getMenuItemsByCategoryId request');
    return await this.menuItemService.getMenuItemsByCategoryId(id);
  }

  @MessagePattern('get-menu-item-by-id')
  async getMenuItemById({ id }: { id: string }): Promise<MenuItem> {
    this.logger.log('Received getMenuItemById request');
    return await this.menuItemService.findById(id);
  }

  @MessagePattern('create-menu-item')
  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    this.logger.log('Received createMenuItem request');
    return await this.menuItemService.create(createMenuItemDto);
  }

  @MessagePattern('update-menu-item')
  async updateMenuItem(
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    this.logger.log('Received updateMenuItem request');
    return await this.menuItemService.update(updateMenuItemDto);
  }

  @MessagePattern('change-menu-item-position')
  async changeMenuItemPosition(
    changeMenuItemPositionDto: ChangePositionDto,
  ): Promise<MenuItem> {
    this.logger.log('Received changeMenuItemPosition request');
    return await this.menuItemService.changePosition(changeMenuItemPositionDto);
  }

  @MessagePattern('delete-menu-item')
  async deleteMenuItem({ id }: { id: string }): Promise<StatusResponseDto> {
    this.logger.log('Received deleteMenuItem request');
    return await this.menuItemService.remove(id);
  }
}
