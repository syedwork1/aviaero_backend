import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";

class FreatureDto {
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

  @ApiProperty({ description: "Plan price", example: 100 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: "Plan features",
    example: [{ name: "ABC", limit: 1, description: "" }],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FreatureDto)
  features: FreatureDto[];
}
