import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { MenuCategoryResolver } from '../menu-category.resolver';
import { MenuCategoryService } from '../menu-category.service';

describe('MenuCategoryResolver', () => {
  let resolver: MenuCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuCategoryResolver,
        MenuCategoryService,
        {
          provide: 'MENU_CATEGORY_SERVICE',
          useValue: {},
        },
        {
          provide: 'MENU_RMQ_MS',
          useValue: {},
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<MenuCategoryResolver>(MenuCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
