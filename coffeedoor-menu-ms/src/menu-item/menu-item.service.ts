import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';
import {
  ChangePositionDto,
  StatusResponseDto,
} from '../menu-category/dto/_index';

import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(MenuItemService.name);

  async getMenuItemsByCategoryId(id: string): Promise<MenuItem[]> {
    try {
      return await this.menuItemRepository.find({
        where: { menuCategory: { id } },
        order: {
          position: 'ASC',
        },
      });
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async findById(id: string): Promise<MenuItem> {
    try {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id },
        relations: ['menuCategory'],
      });
      if (!menuItem) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu item not found',
        });
      }
      return menuItem;
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    try {
      return await this.entityManager.save(MenuItem, {
        ...createMenuItemDto,
        language: createMenuItemDto.language as LanguageCode,
      });
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async update(updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    try {
      const menuItemToUpdate = await this.menuItemRepository.findOne({
        where: { id: updateMenuItemDto.id },
      });
      if (!menuItemToUpdate) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu item not found',
        });
      }
      Object.assign(menuItemToUpdate, updateMenuItemDto);
      return await this.entityManager.save('MenuItem', menuItemToUpdate);
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async changePosition(
    changeMenuItemPosition: ChangePositionDto,
  ): Promise<MenuItem> {
    try {
      const { id, oldPosition, newPosition } = changeMenuItemPosition;
      const menuItem = await this.menuItemRepository.findOne({
        where: { id },
        relations: ['menuCategory'],
      });
      if (!menuItem) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu item not found',
        });
      }
      const updatedMenuItem = await this.menuItemRepository.save({
        ...menuItem,
        position: newPosition,
      });

      const { language, menuCategory } = menuItem;
      await this.menuItemRepository
        .createQueryBuilder()
        .update(MenuItem)
        .set({
          position: () => `position ${oldPosition < newPosition ? '-' : '+'} 1`,
        })
        .where('id != :id', { id })
        .andWhere('language = :language', { language })
        .andWhere('menuCategoryId = :menuCategoryId', {
          menuCategoryId: menuCategory.id,
        })
        .andWhere('position BETWEEN :minPosition AND :maxPosition', {
          minPosition: Math.min(oldPosition, newPosition),
          maxPosition: Math.max(oldPosition, newPosition),
        })
        .execute();

      return updatedMenuItem;
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }

  async remove(id: string): Promise<StatusResponseDto> {
    try {
      const result = await this.menuItemRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu item not found',
        });
      }
      return {
        status: true,
        message: `Menu item ${id} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }
}
