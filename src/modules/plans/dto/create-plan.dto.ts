import { PlanTypeEnum } from "@core/enums/plan.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class FeatureDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  limit: number;

  @IsNotEmpty()
  @IsBoolean()
  limited: boolean;
}

class DurationDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  durationInMonths: number;
}

export class CreatePlanDto {
  @ApiProperty({ description: "Plan name", example: "Standarad" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Plan description",
    example: "This is a plan description",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Plan status", example: "INACTIVE" })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: "Plan status", enum: PlanTypeEnum })
  @IsNotEmpty()
  @IsEnum(PlanTypeEnum)
  @IsString()
  type: string;

  @ApiProperty({
    description: "Plan Subject",
  })
  @IsOptional()
  subjectId?: string;

  @ApiProperty({
    description: "Plan features",
    example: [{ name: "ABC", limit: 1, description: "" }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features?: FeatureDto[];

  @ApiProperty({
    description: "Plan duration",
    example: [{ durationInMonths: 2, price: 19.99 }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DurationDto)
  durations?: DurationDto[];
}
