import { Test, TestingModule } from '@nestjs/testing';
import { ProductEnrichmentService } from './product-enrichment.service';

describe('ProductEnrichmentService', () => {
  let service: ProductEnrichmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductEnrichmentService],
    }).compile();

    service = module.get<ProductEnrichmentService>(ProductEnrichmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
