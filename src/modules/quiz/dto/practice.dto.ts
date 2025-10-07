import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PracticeQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questions: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPractice: boolean;
}
