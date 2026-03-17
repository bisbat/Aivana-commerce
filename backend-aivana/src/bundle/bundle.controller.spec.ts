import { Test, TestingModule } from '@nestjs/testing';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';

describe('BundleController', () => {
  let controller: BundleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BundleController],
      providers: [BundleService],
    }).compile();

    controller = module.get<BundleController>(BundleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
