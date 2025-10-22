import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ActivatePlanDto {
  @ApiProperty({
    description: "Plan Id",
  })
  @IsString()
  @IsNotEmpty()
  planId: string;
}
