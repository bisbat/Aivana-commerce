import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PayoutService } from './payout.service';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';

@Controller('payouts')
export class PayoutController {
  constructor(private readonly PayoutService: PayoutService) {}

  @Post()
  create(@Body() createPayoutDto: CreatePayoutDto) {
    return this.PayoutService.create(createPayoutDto);
  }

  @Get()
  findAll() {
    return this.PayoutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.PayoutService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayoutDto: UpdatePayoutDto) {
    return this.PayoutService.update(+id, updatePayoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.PayoutService.remove(+id);
  }
}
