import { Test, TestingModule } from '@nestjs/testing';
import { UserCollectionController } from './user-collection.controller';

describe('UserCollectionController', () => {
  let controller: UserCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCollectionController],
    }).compile();

    controller = module.get<UserCollectionController>(UserCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
