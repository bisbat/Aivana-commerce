import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayoutItemService } from './payout-item.service';
import { CreatePayoutItemDto } from './dto/create-payout-item.dto';
import { UpdatePayoutItemDto } from './dto/update-payout-item.dto';

@Controller('payout-item')
export class PayoutItemController {
  constructor(private readonly payoutItemService: PayoutItemService) {}

  @Post()
  create(@Body() createPayoutItemDto: CreatePayoutItemDto) {
    return this.payoutItemService.create(createPayoutItemDto);
  }

  @Get()
  findAll() {
    return this.payoutItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payoutItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayoutItemDto: UpdatePayoutItemDto) {
    return this.payoutItemService.update(+id, updatePayoutItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payoutItemService.remove(+id);
  }
}
