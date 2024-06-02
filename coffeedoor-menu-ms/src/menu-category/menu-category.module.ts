import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryController } from './menu-category.controller';
import { MenuCategory } from './entities/menu-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuCategory])],
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService],
})
export class MenuCategoryModule {}
