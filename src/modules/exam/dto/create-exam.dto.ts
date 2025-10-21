import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  MinDate,
  ArrayMinSize,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateExamDto {
  @ApiProperty({ example: "Exam Name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "number of questions" })
  @IsNumber()
  @IsNotEmpty()
  number_of_questions: number;

  @ApiProperty({ example: "Difficulty" })
  @IsString()
  difficulty: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  CBR_chapters: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  coursesIds: string[];

  @ApiProperty({
    description: "The scheduled time for the quiz .",
  })
  @IsNotEmpty()
  time: number;

  // @ApiProperty({ example: 'Status' })
  // @IsEnum(ExamStatus)
  // status: ExamStatus;

  // Optional array of questions to create with the exam
  // @ApiProperty({ example: 'Questions' })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CreateQuestionDto)
  // questions?: CreateQuestionDto[];
}
