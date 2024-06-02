import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { RoleTypes } from '../common/types/enums';
import { IdDto, StatusResponse } from '../common/_index';
import { HasRoles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import { MenuCategoryService } from './menu-category.service';
import { MenuCategory } from './entities/menu-category.entity';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { ChangeMenuCategoryPositionDto } from './dto/change-menu-category-position.dto';
import { MenuCategoryWithItems } from './entities/menu-category-with-items.entity';

@Resolver()
@HasRoles(RoleTypes.ADMIN, RoleTypes.SUBADMIN)
@UseGuards(GqlAuthGuard, RolesGuard)
export class MenuCategoryResolver {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Query(() => [MenuCategoryWithItems])
  async getMenuCategories(): Promise<MenuCategoryWithItems[]> {
    return this.menuCategoryService.findAll();
  }

  @Query(() => MenuCategoryWithItems)
  async getMenuCategoryById(
    @Args('idDto') idDto: IdDto,
  ): Promise<MenuCategoryWithItems> {
    return this.menuCategoryService.findById(idDto.id);
  }

  @Mutation(() => MenuCategory)
  async createMenuCategory(
    @Args('createMenuCategoryDto') createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.create(createMenuCategoryDto);
  }

  @Mutation(() => MenuCategory)
  async updateMenuCategory(
    @Args('updateMenuCategoryDto') updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.update(updateMenuCategoryDto);
  }

  @Mutation(() => MenuCategory)
  async changeMenuCategoryPosition(
    @Args('changeMenuCategoryPositionDto')
    changeMenuCategoryPositionDto: ChangeMenuCategoryPositionDto,
  ): Promise<MenuCategory> {
    return this.menuCategoryService.changePosition(
      changeMenuCategoryPositionDto,
    );
  }

  @Mutation(() => StatusResponse)
  async deleteMenuCategory(
    @Args('idDto') idDto: IdDto,
  ): Promise<StatusResponse> {
    return this.menuCategoryService.remove(idDto.id);
  }
}
