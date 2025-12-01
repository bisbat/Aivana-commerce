import { Test, TestingModule } from '@nestjs/testing';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

describe('SellersController', () => {
  let controller: SellersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellersController],
      providers: [SellersService],
    }).compile();

    controller = module.get<SellersController>(SellersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
