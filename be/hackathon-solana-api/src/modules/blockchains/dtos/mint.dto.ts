import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class MintTxDto{
    @ApiProperty()
    @IsNotEmpty()
    base64_serialized_tx: string;
}
