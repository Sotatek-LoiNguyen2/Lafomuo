import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetSignatureInput {
  @ApiProperty()
  @IsNotEmpty()
  evaluation_id: string;

  @ApiProperty()
  @IsNotEmpty()
  base64_serialized_tx: string;
}