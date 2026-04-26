import { PartialType } from '@nestjs/swagger';
import { CreateOmiseDto } from './create-omise.dto';

export class UpdateOmiseDto extends PartialType(CreateOmiseDto) {}
