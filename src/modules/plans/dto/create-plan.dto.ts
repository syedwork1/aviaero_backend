import { PlanStatusEnum } from "@core/enums/plan.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
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

  @ApiProperty({ description: "Plan status", enum: PlanStatusEnum })
  @IsNotEmpty()
  @IsEnum(PlanStatusEnum)
  @IsString()
  type: string;

  @ApiProperty({ description: "Plan price", example: 100 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

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
}
