import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class StartQuizDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  examId: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questions: number;
}

export class FinishQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizId: string;
}

export class SubmitQuizAnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty()
  @IsString()
  selectedAnswer: string;
}
