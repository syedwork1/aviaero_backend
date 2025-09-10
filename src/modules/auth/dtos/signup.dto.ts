import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password (minimum 8 characters)', example: 'StrongPassword123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  // @ApiProperty({ description: 'role', example: 'STUDENT' })
  // @IsString()
  // @IsNotEmpty()
  // role: string;

  // @ApiProperty({ description: 'User phone number', example: '+1234567890' })
  // @IsString()
  // @IsNotEmpty()
  // //@Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid international format' })
  // phone: string;

  // @ApiProperty({ description: 'Unique username (alphanumeric and underscores only)', example: 'johndoe' })
  // @IsString()
  // @IsNotEmpty()
  // @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  // username: string;
}
