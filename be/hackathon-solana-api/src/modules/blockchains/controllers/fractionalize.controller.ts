import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { ReqContext } from "src/shared/request-context/req-context.decorator";
import { FractionalizeTxDto } from '../dtos/fractionalize.dto';
import { FractionalizeService } from '../services/fractionalize.service';

@Controller('fractionalize')
@ApiTags('Fractionalize')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FractionalizeController {
    constructor(private readonly fractionalizeService: FractionalizeService){}

    @Post('/:id')
    async fractionalize(
        @ReqContext() ctx: RequestContext,
        @Param('id') id:string, 
        @Body() tx: FractionalizeTxDto){
        return await this.fractionalizeService.fractionalize(ctx, id ,tx.base64_serialized_tx);
    }
}
