import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({ description: 'The school name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'school is active or not' })
  @IsString()
  @IsNotEmpty()
  status: string;

  

}