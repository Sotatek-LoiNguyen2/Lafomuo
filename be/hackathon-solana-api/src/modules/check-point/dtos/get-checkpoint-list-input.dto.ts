import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetCheckPointListInput {
  @ApiProperty()
  @IsNotEmpty()
  evaluation_id: string;
}