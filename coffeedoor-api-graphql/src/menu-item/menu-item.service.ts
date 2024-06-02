import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { StatusResponse } from '../common/_index';
import {
  ChangeMenuItemPositionDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/_index';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @Inject('MENU_RMQ_MS') private readonly menuRMQClient: ClientProxy,
  ) {}

  async findAllByCategoryId(id: string): Promise<MenuItem[]> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuItem[], { id: string }>(
          'get-menu-items-by-category-id',
          { id },
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuItemService: findAllByCategoryId',
      });
    }
  }

  async findById(id: string): Promise<MenuItem> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuItem, { id: string }>(
          'get-menu-item-by-id',
          { id },
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuItemService: findById',
      });
    }
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuItem, CreateMenuItemDto>(
          'create-menu-item',
          createMenuItemDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuItemService: create',
      });
    }
  }

  async update(updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuItem, UpdateMenuItemDto>(
          'update-menu-item',
          updateMenuItemDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuItemService: update',
      });
    }
  }

  async changePosition(
    changeMenuItemPositionDto: ChangeMenuItemPositionDto,
  ): Promise<MenuItem> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuItem, ChangeMenuItemPositionDto>(
          'change-menu-item-position',
          changeMenuItemPositionDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuItemService: changePosition',
      });
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<StatusResponse, { id: string }>(
          'remove-menu-item',
          { id },
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuItemService: remove',
      });
    }
  }
}
