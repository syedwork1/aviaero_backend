import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ExamStatus } from '../enums/role.enum';
import { CreateQuestionDto } from '../../questions/dto/create-question.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamDto {

  @ApiProperty({ example: 'Exam Name' })  
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mobility' })  
  @IsString()
  @IsNotEmpty()
  Mobility: string;

  @ApiProperty({ example: 'Difficulty' })  
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ example: 'CBR Chapter' })  
  @IsString()
  @IsNotEmpty()
  CBR_chapter: string;

  @ApiProperty({ example: 'Status' })  
  @IsEnum(ExamStatus)
  status: ExamStatus;

  // Optional array of questions to create with the exam
  @ApiProperty({ example: 'Questions' })  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}
