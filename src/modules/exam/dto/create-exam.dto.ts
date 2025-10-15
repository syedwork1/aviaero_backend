import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";
import { ExamStatus } from "../enums/role.enum";
import { CreateQuestionDto } from "../../questions/dto/create-question.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateExamDto {
  @ApiProperty({ example: "Exam Name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "number of questions" })
  @IsNotEmpty()
  number_of_questions: number;

  @ApiProperty({ example: "Difficulty" })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ example: "CBR Chapter" })
  @IsString()
  @IsNotEmpty()
  CBR_chapter: string;

  @ApiProperty({ example: "Quiz End Date" })
  @IsNotEmpty()
  end_date: Date;

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
