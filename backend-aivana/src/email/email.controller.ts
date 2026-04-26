import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailSuccessDto } from './dto/create-success-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post()
  async sendEmail(@Body() emailData: CreateEmailSuccessDto) {
    return this.emailService.sendSuccessEmail(emailData);
  }

}
