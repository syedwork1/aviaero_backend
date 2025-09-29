import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "CBR chapter reference" })
  @IsString()
  @IsNotEmpty()
  cbr: string;
}
