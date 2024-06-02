import { Field, ObjectType } from '@nestjs/graphql';

import { MenuItem } from '../../menu-item/entities/menu-item.entity';
import { MenuCategory } from './menu-category.entity';

@ObjectType()
export class MenuCategoryWithItems extends MenuCategory {
  @Field(() => [MenuItem], { nullable: true })
  menuItems: MenuItem[];
}
