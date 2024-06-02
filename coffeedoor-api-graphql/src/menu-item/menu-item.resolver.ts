import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { HasRoles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RoleTypes } from '../common/types/enums';
import { IdDto, StatusResponse } from '../common/_index';

import { MenuItemService } from './menu-item.service';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { ChangeMenuItemPositionDto } from './dto/change-menu-item-position.dto';

@Resolver()
@HasRoles(RoleTypes.ADMIN, RoleTypes.SUBADMIN)
@UseGuards(GqlAuthGuard, RolesGuard)
export class MenuItemResolver {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Query(() => [MenuItem])
  async getMenuItemsByCategoryId(
    @Args('idDto') idDto: IdDto,
  ): Promise<MenuItem[]> {
    return this.menuItemService.findAllByCategoryId(idDto.id);
  }

  @Query(() => MenuItem)
  async getMenuItemById(@Args('idDto') idDto: IdDto): Promise<MenuItem> {
    return this.menuItemService.findById(idDto.id);
  }

  @Mutation(() => MenuItem)
  async createMenuItem(
    @Args('createMenuItemDto') createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Mutation(() => MenuItem)
  async updateMenuItem(
    @Args('updateMenuItemDto') updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemService.update(updateMenuItemDto);
  }

  @Mutation(() => MenuItem)
  async changeMenuItemPosition(
    @Args('changeMenuItemPositionDto')
    changeMenuItemPositionDto: ChangeMenuItemPositionDto,
  ): Promise<MenuItem> {
    return this.menuItemService.changePosition(changeMenuItemPositionDto);
  }

  @Mutation(() => StatusResponse)
  async deleteMenuItem(@Args('idDto') idDto: IdDto): Promise<StatusResponse> {
    return this.menuItemService.remove(idDto.id);
  }
}
