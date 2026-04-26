import { Test, TestingModule } from '@nestjs/testing';
import { PayoutItemController } from './payout-item.controller';
import { PayoutItemService } from './payout-item.service';

describe('PayoutItemController', () => {
  let controller: PayoutItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayoutItemController],
      providers: [PayoutItemService],
    }).compile();

    controller = module.get<PayoutItemController>(PayoutItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
