import { Args, Query, Resolver } from '@nestjs/graphql';

import { LanguageDto } from '../common/_index';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryWithItems } from './entities/menu-category-with-items.entity';

@Resolver()
export class AllMenuResolver {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @Query(() => [MenuCategoryWithItems], { name: 'getMenuByLanguage' })
  async getMenuByLanguage(
    @Args('languageDto') languageDto: LanguageDto,
  ): Promise<MenuCategoryWithItems[]> {
    return this.menuCategoryService.findByLanguage(languageDto.language);
  }
}
