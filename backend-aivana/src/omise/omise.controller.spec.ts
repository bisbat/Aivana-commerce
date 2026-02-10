import { Test, TestingModule } from '@nestjs/testing';
import { OmiseController } from './omise.controller';
import { OmiseService } from './omise.service';

describe('OmiseController', () => {
  let controller: OmiseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OmiseController],
      providers: [OmiseService],
    }).compile();

    controller = module.get<OmiseController>(OmiseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
