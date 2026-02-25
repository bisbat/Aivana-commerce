import { PartialType } from '@nestjs/swagger';
import { CreateEmailSuccessDto } from './create-email.dto';

export class UpdateEmailDto extends PartialType(CreateEmailSuccessDto) {}
