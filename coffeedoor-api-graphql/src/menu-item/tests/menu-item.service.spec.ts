import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemService } from '../menu-item.service';

describe('MenuItemService', () => {
  let service: MenuItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<MenuItemService>(MenuItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
