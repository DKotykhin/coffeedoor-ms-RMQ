import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { LanguageCode } from '../database/db.enums';

import { MenuCategoryService } from './menu-category.service';
import { MenuCategory } from './entities/menu-category.entity';
import {
  ChangePositionDto,
  CreateMenuCategoryDto,
  StatusResponseDto,
  UpdateMenuCategoryDto,
} from './dto/_index';

@Controller()
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}
  protected readonly logger = new Logger(MenuCategoryController.name);

  @MessagePattern('get-menu-categories-by-language')
  getMenuCategoriesByLanguage({
    language,
  }: {
    language: LanguageCode;
  }): Promise<MenuCategory[]> {
    this.logger.log('Received getMenuCategoriesByLanguage request');
    return this.menuCategoryService.findByLanguage(language);
  }

  @MessagePattern('get-menu-categories')
  getAllMenuCategories(): Promise<MenuCategory[]> {
    this.logger.log('Received getAllMenuCategories request');
    return this.menuCategoryService.findAll();
  }

  @MessagePattern('get-menu-category-by-id')
  getMenuCategoryById({ id }: { id: string }): Promise<MenuCategory> {
    this.logger.log('Received getMenuCategoryById request');
    return this.menuCategoryService.findById(id);
  }

  @MessagePattern('create-menu-category')
  createMenuCategory(
    createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    this.logger.log('Received createMenuCategory request');
    return this.menuCategoryService.create(createMenuCategoryDto);
  }

  @MessagePattern('update-menu-category')
  updateMenuCategory(
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    this.logger.log('Received updateMenuCategory request');
    return this.menuCategoryService.update(updateMenuCategoryDto);
  }

  @MessagePattern('change-menu-category-position')
  changeMenuCategoryPosition(
    changeMenuCategoryPositionDto: ChangePositionDto,
  ): Promise<MenuCategory> {
    this.logger.log('Received changeMenuCategoryPosition request');
    return this.menuCategoryService.changePosition(
      changeMenuCategoryPositionDto,
    );
  }

  @MessagePattern('delete-menu-category')
  deleteMenuCategory({ id }: { id: string }): Promise<StatusResponseDto> {
    this.logger.log('Received deleteMenuCategory request');
    return this.menuCategoryService.delete(id);
  }
}
