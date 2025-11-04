import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ReportQuestionDto {
  @ApiProperty({ description: "reason" })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ description: "description" })
  @IsString()
  @IsOptional()
  description: string;
}
