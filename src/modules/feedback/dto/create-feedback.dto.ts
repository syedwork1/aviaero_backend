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
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ description: "exam id" })
  @IsString()
  @IsNotEmpty()
  examId: string;

  @ApiProperty({ description: "subject id" })
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty({ description: "student id" })
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
