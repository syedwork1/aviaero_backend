import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

export enum FixQuestionReportStatusEnum {
  resolved = "RESOLVED",
  discard = "DISCARD",
}

export class FixQuestionReportDto {
  @ApiProperty({ description: "status", enum: FixQuestionReportStatusEnum })
  @IsEnum(FixQuestionReportStatusEnum)
  status: FixQuestionReportStatusEnum;
}
