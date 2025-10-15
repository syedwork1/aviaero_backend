import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsDate,
  IsNumber,
  isDate,
  MinDate,
  IsDateString,
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
  @IsNumber()
  @IsNotEmpty()
  number_of_questions: number;

  @ApiProperty({ example: "Difficulty" })
  @IsString()
  difficulty: string;

  @ApiProperty({ example: "CBR Chapter" })
  @IsString()
  CBR_chapter: string;

  @ApiProperty({ example: "Quiz End Date" })
  @IsNotEmpty({ message: "Booking date cannot be empty." })
  @IsDate()
  @MinDate(new Date(), { message: "Booking date must be in the future." })
  @Type(() => Date)
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
