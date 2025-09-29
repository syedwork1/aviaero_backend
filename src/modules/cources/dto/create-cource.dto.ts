import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CourceStatus } from "../enums/status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourceDto {
  @ApiProperty({ example: "cource Name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "description" })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: CourceStatus.ACTIVE })
  @IsEnum(CourceStatus)
  status: CourceStatus;
}
