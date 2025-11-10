import { IsNotEmpty, IsString } from "class-validator";

export class BulkUploadExamDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
