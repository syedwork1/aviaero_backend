import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class StartQuizDto {
  @ApiProperty()
  @IsString()
  examId: string;

  @ApiProperty()
  @IsArray({ each: true })
  cbr_chapters: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questions: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPractice: boolean;
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
