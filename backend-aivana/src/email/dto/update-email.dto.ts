import { PartialType } from '@nestjs/swagger';
import { CreateEmailSuccessDto } from './create-success-email.dto';

export class UpdateEmailDto extends PartialType(CreateEmailSuccessDto) {}
