import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { MenuCategoryService } from '../menu-category.service';
import { AllMenuResolver } from '../all-menu.resolver';

describe('AllMenuResolver', () => {
  let resolver: AllMenuResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllMenuResolver,
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

    resolver = module.get<AllMenuResolver>(AllMenuResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
