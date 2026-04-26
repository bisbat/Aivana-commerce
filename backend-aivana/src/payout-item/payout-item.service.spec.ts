import { Test, TestingModule } from '@nestjs/testing';
import { PayoutItemService } from './payout-item.service';

describe('PayoutItemService', () => {
  let service: PayoutItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayoutItemService],
    }).compile();

    service = module.get<PayoutItemService>(PayoutItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
