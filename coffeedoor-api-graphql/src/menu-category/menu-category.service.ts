import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

import { LanguageCode, StatusResponse } from '../common/_index';

import {
  ChangeMenuCategoryPositionDto,
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
} from './dto/_index';
import { MenuCategoryWithItems } from './entities/menu-category-with-items.entity';
import { MenuCategory } from './entities/menu-category.entity';

@Injectable()
export class MenuCategoryService {
  constructor(
    @Inject('MENU_RMQ_MS') private readonly menuRMQClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findByLanguage(
    language: LanguageCode,
  ): Promise<MenuCategoryWithItems[]> {
    try {
      const menu: {
        language: LanguageCode;
        menuCategoryList: MenuCategoryWithItems[];
      } = await this.cacheManager.get('menu');
      if (menu && menu.language === language) {
        return menu.menuCategoryList;
      }
      const menuCategoryList = await firstValueFrom(
        this.menuRMQClient.send<
          MenuCategoryWithItems[],
          { language: LanguageCode }
        >('get-menu-categories-by-language', { language }),
      );
      await this.cacheManager.set('menu', { language, menuCategoryList });
      return menuCategoryList;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: findByLanguage',
      });
    }
  }

  async findAll(): Promise<MenuCategoryWithItems[]> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuCategoryWithItems[], any>(
          'get-menu-categories',
          {},
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: findAll',
      });
    }
  }

  async findById(id: string): Promise<MenuCategoryWithItems> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuCategoryWithItems, { id: string }>(
          'get-menu-category-by-id',
          { id },
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: findById',
      });
    }
  }

  async create(
    createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuCategory, CreateMenuCategoryDto>(
          'create-menu-category',
          createMenuCategoryDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: create',
      });
    }
  }

  async update(
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuCategory, UpdateMenuCategoryDto>(
          'update-menu-category',
          updateMenuCategoryDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: update',
      });
    }
  }

  async changePosition(
    changeMenuCategoryPositionDto: ChangeMenuCategoryPositionDto,
  ): Promise<MenuCategory> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<MenuCategory, ChangeMenuCategoryPositionDto>(
          'change-menu-category-position',
          changeMenuCategoryPositionDto,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: changePosition',
      });
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      return await firstValueFrom(
        this.menuRMQClient.send<StatusResponse, { id: string }>(
          'delete-menu-category',
          { id },
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status || 500, {
        cause: 'MenuCategoryService: remove',
      });
    }
  }
}
