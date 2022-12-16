import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetLockerInput {
    @ApiProperty()
    @IsNotEmpty()
    locker: string;

    @ApiProperty()
    @IsNotEmpty()
    escrow_owner: string;
}