import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFeedbackDto {
  @ApiProperty({ description: "feedback" })
  @IsString()
  @IsNotEmpty()
  feedback: string;

  @ApiProperty({ description: "rating" })
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({ description: "category id" })
  @IsNumber()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: "exam id" })
  @IsNumber()
  @IsNotEmpty()
  examId: string;

  @ApiProperty({ description: "subject id" })
  @IsNumber()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ description: "student id" })
  @IsNumber()
  @IsNotEmpty()
  studentId: string;
}
