import { Test, TestingModule } from '@nestjs/testing';
import { PayoutService } from './payout.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItemEntity } from '../order-item/entities/order-item.entity';
import { PayoutEntity } from './entities/payout.entity';
import { PayoutItemEntity } from '../payout-item/entities/payout-item.entity';
import { MinioService } from '../minio/minio.service';
import { getHalfMonthRange } from './helpers/payout-date.helper';


describe('PayoutService', () => {
  let service: PayoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayoutService,
        { provide: getRepositoryToken(OrderItemEntity), useValue: {} },
        { provide: getRepositoryToken(PayoutEntity), useValue: {} },
        { provide: getRepositoryToken(PayoutItemEntity), useValue: {} },
        { provide: MinioService, useValue: {} },
      ],
    }).compile();

    service = module.get<PayoutService>(PayoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('getHalfMonthRange', () => {
  it('returns 16-last day when date is 1st', () => {
    const testDate = new Date('2026-02-01');
    const { start, end } = getHalfMonthRange(testDate);

    expect(start.getDate()).toBe(16);
    expect(end.getDate()).toBe(31);
  });


  it('returns 1-15 of current month when date is 16th', () => {
    const testDate = new Date('2026-02-16');

    const { start, end } = getHalfMonthRange(testDate);

    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(15);
  });
});
