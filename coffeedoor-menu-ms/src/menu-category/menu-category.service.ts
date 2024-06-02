import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';

import { MenuCategory } from './entities/menu-category.entity';
import {
  ChangePositionDto,
  CreateMenuCategoryDto,
  StatusResponseDto,
  UpdateMenuCategoryDto,
} from './dto/_index';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(MenuCategoryService.name);

  async findByLanguage(language: LanguageCode): Promise<MenuCategory[]> {
    try {
      return await this.menuCategoryRepository.find({
        where: {
          language,
          hidden: false,
        },
        relations: ['menuItems'],
        order: {
          position: 'ASC',
          menuItems: {
            position: 'ASC',
          },
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

  async findAll(): Promise<MenuCategory[]> {
    try {
      return await this.menuCategoryRepository.find({
        relations: ['menuItems'],
        order: {
          position: 'ASC',
          menuItems: {
            position: 'ASC',
          },
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

  async findById(id: string): Promise<MenuCategory> {
    try {
      const menuCategory = await this.menuCategoryRepository.findOne({
        where: { id },
        relations: ['menuItems'],
      });
      if (!menuCategory) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu category not found',
        });
      }
      return menuCategory;
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

  async create(
    createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      return await this.entityManager.save(MenuCategory, {
        ...createMenuCategoryDto,
        language: createMenuCategoryDto.language as LanguageCode,
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

  async update(
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      const menuCategory = await this.findById(updateMenuCategoryDto.id);
      if (!menuCategory) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu category not found',
        });
      }
      Object.assign(menuCategory, updateMenuCategoryDto);
      return await this.entityManager.save('MenuCategory', menuCategory);
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
    changeMenuCategoryPosition: ChangePositionDto,
  ): Promise<MenuCategory> {
    try {
      const { id, oldPosition, newPosition } = changeMenuCategoryPosition;
      const menuCategory = await this.menuCategoryRepository.findOne({
        where: { id },
      });
      if (!menuCategory) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu category not found',
        });
      }
      const updatedMenuCategory = await this.menuCategoryRepository.save({
        ...menuCategory,
        position: newPosition,
      });
      await this.menuCategoryRepository
        .createQueryBuilder()
        .update(MenuCategory)
        .set({
          position: () => `position ${oldPosition < newPosition ? '-' : '+'} 1`,
        })
        .where('id != :id', { id })
        .andWhere('language = :language', { language: menuCategory.language })
        .andWhere('position BETWEEN :minPosition AND :maxPosition', {
          minPosition: Math.min(oldPosition, newPosition),
          maxPosition: Math.max(oldPosition, newPosition),
        })
        .execute();
      return updatedMenuCategory;
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

  async delete(id: string): Promise<StatusResponseDto> {
    try {
      const result = await this.menuCategoryRepository.delete(id);
      if (result.affected === 0) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Menu category not found',
        });
      }
      return {
        status: true,
        message: `Menu category ${id} successfully deleted`,
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
