import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlanDto {
  @ApiProperty({ description: "Plan name", example: "Standarad" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Plan description",
    example: "This is a plan description",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Plan price", example: 100 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: "No of exams plan include", example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  exam: number;

  @ApiProperty({ description: "No of quiz plan include", example: 10 })
  @IsNumber()
  @IsNotEmpty()
  quiz: number;

  @ApiProperty({ description: "No of students plan include", example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  student: number;

  @ApiProperty({
    description: "Plan description",
    example: "This is a plan description",
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
