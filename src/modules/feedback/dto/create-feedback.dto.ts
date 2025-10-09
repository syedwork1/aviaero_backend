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

  @ApiProperty({ description: "quiz id" })
  @IsString()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ description: "student id" })
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
