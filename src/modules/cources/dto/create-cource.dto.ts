import { IsEnum, IsNotEmpty, IsString} from 'class-validator';
import {CategoryStatus} from '../enums/status.enum'
import { ApiProperty } from '@nestjs/swagger';


export class CreateCourceDto {

  @ApiProperty({ example: 'cource Name' })  
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'description' })  
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'subject Name' })  
  @IsString()
  @IsNotEmpty()
  subjectName: string;

  @ApiProperty({ example: 'category ID' })  
  @IsString()
  @IsNotEmpty()
  categoryId: string;
  

  @ApiProperty({ example: CategoryStatus.ACTIVE })  
  @IsEnum(CategoryStatus)
  status: CategoryStatus;

}
