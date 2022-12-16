import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateAssetMetaData {
  @ApiProperty()
  @IsNotEmpty()
  assetMetadata: string;

  @ApiProperty()
  @IsNotEmpty()
  mintKey: string;
}