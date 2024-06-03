import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { MenuCategoryService } from '../menu-category.service';

describe('MenuCategoryService', () => {
  let service: MenuCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<MenuCategoryService>(MenuCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
