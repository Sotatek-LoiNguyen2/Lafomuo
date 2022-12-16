import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class FractionalizeTxDto{
    @ApiProperty()
    @IsNotEmpty()
    base64_serialized_tx: string;
}
