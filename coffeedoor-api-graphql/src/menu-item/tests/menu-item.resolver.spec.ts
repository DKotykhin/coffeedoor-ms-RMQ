import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemResolver } from '../menu-item.resolver';
import { MenuItemService } from '../menu-item.service';

describe('MenuItemResolver', () => {
  let resolver: MenuItemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemResolver,
        MenuItemService,
        {
          provide: 'MENU_ITEM_SERVICE',
          useValue: {},
        },
        {
          provide: 'MENU_RMQ_MS',
          useValue: {},
        },
      ],
    }).compile();

    resolver = module.get<MenuItemResolver>(MenuItemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
