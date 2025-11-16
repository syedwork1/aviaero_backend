import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ArrayMinSize,
  IsArray,
} from "class-validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";

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

export class UpdateExamDto extends PartialType(CreateExamDto) {}

export class BulkUploadExamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ type: "string", format: "binary", required: true })
  file: Express.Multer.File;
}

export class StartExamDto {
  @ApiProperty()
  @IsString()
  examId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;
}

export class FinishExamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quizId: string;
}

export class SubmitExamAnswerDto {
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
