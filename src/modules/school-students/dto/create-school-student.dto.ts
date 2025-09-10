import { IsString, IsNotEmpty, IsDateString,IsArray,ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolStudentDto {
  
  @ApiProperty()
  @IsString()
  schoolId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  studentIds: string[]; 

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDateString()
  enrolmentDate: Date;
}
