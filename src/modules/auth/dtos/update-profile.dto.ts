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

  @ApiProperty({ description: "User first name", example: "John" })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ description: "User last name", example: "Doe" })
  @IsString()
  @IsOptional()
  lastName: string;
}
