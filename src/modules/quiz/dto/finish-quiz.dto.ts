import { IsString, IsNotEmpty, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FinishQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizId: string;
}
