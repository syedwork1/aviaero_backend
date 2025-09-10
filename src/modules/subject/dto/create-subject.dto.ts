import {  IsNotEmpty,  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
