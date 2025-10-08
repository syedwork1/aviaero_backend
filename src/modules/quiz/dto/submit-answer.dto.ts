import { IsString, IsNotEmpty, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
