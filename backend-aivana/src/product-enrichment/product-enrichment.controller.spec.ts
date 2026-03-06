import { Test, TestingModule } from '@nestjs/testing';
import { ProductEnrichmentController } from './product-enrichment.controller';

describe('ProductEnrichmentController', () => {
  let controller: ProductEnrichmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductEnrichmentController],
    }).compile();

    controller = module.get<ProductEnrichmentController>(ProductEnrichmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
