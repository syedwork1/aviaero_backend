import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiProperty({ description: "User avatar" })
  @IsString()
  @IsOptional()
  avatar: string;

  @ApiProperty({ description: "User email" })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: "User password (minimum 8 characters)",
    example: "StrongPassword123!",
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: "User first name", example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: "User last name", example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
