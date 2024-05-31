import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService } from '../health-check.service';

describe('HealthCheckService', () => {
  let service: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCheckService,
        {
          provide: 'MENU_RMQ_MS',
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: 'USER_RMQ_MS',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
