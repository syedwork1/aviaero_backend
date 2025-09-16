import { PartialType } from '@nestjs/swagger';
import { CreateCourceDto } from './create-cource.dto';

export class UpdateCourceDto extends PartialType(CreateCourceDto) {}
