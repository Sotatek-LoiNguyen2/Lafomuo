import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MintTxDto } from '../dtos/mint.dto';
import { MintService } from '../services/mint.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReqContext } from "src/shared/request-context/req-context.decorator";
import { RequestContext } from "src/shared/request-context/request-context.dto";

@Controller('mint')
@ApiTags('Mint')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MintController {
    constructor(private readonly mintService: MintService){}

    @Post('/:id')
    async mint(
        @ReqContext() ctx: RequestContext,
        @Param('id') id:string, 
        @Body() tx: MintTxDto){
        return await this.mintService.mint(ctx, id, tx.base64_serialized_tx);
    }
}
