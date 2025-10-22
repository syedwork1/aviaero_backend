import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

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
}
