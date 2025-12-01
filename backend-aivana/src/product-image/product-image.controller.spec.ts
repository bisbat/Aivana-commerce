import { Test, TestingModule } from '@nestjs/testing';
import { ProductImageController } from './product-image.controller';
import { ProductImageService } from './product-image.service';

describe('ProductImageController', () => {
  let controller: ProductImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductImageController],
      providers: [ProductImageService],
    }).compile();

    controller = module.get<ProductImageController>(ProductImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
