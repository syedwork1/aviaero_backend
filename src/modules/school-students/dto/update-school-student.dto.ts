import { PartialType } from '@nestjs/swagger';
import { CreateSchoolStudentDto } from './create-school-student.dto';

export class UpdateSchoolStudentDto extends PartialType(CreateSchoolStudentDto) {}
