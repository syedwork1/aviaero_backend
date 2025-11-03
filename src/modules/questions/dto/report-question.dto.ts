import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReportQuestionDto {
  @ApiProperty({ description: "description" })
  @IsString()
  @IsNotEmpty()
  description: string;
}
