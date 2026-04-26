import { PartialType } from '@nestjs/swagger';
import { CreatePayoutItemDto } from './create-payout-item.dto';

export class UpdatePayoutItemDto extends PartialType(CreatePayoutItemDto) {}
