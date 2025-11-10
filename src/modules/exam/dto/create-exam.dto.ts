import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ArrayMinSize,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
  @IsString()
  @IsNotEmpty()
  coursesId: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  questionIds: string[];

  @ApiProperty({
    description: "The scheduled time for the quiz .",
  })
  @IsNotEmpty()
  time: number;
}
