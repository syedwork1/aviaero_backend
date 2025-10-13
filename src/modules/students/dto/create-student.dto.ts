import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentDto {
  @ApiProperty({
    description: "student email address",
    example: "student@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "student password (minimum 8 characters)",
    example: "StrongPassword123!",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: "school id",
  })
  @IsString()
  schoolId: string;

  @ApiProperty({ description: "student first name", example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: "student last name", example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
