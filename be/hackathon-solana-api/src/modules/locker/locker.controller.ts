import { Body, Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { BaseApiResponse } from "src/shared/dtos/base-api-response.dto";
import { ReqContext } from "src/shared/request-context/req-context.decorator";
import { RequestContext } from "src/shared/request-context/request-context.dto";
import { LockEvent } from "../evaluation/schemas/lock-event.schema";
import { GetLockerInput } from "./dtos/get-locker-input.dto";
import { LockerService } from "./locker.service";

@Controller('locker')
@ApiTags('Locker API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LockerController {
    constructor(private readonly lockerService: LockerService){}

    @Get(':locker/:escrow_owner')
    @ApiOperation({
        description: 'Get Summary Lock'
    })
    async getSummaryLock(@ReqContext() ctx: RequestContext, @Param('locker') locker: string, @Param('escrow_owner') escrow_owner: string): Promise<BaseApiResponse<LockEvent>> {
        const lockEvent =  await this.lockerService.getSummaryLock(ctx, locker, escrow_owner);
        return {
            data: lockEvent,
            meta: {}
        }
    }
}