import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCheckPointInput {
  @ApiProperty()
  @IsNotEmpty()
  dividend_distributor: string;

  @ApiProperty()
  @IsNotEmpty()
  evaluation_id: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  token_address: string;

  @ApiProperty()
  @IsNotEmpty()
  reportFile: {
    name: string,
    data: string,
  };
}
