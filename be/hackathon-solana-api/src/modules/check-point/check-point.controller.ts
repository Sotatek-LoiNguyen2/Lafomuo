import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CheckPoint } from '../evaluation/schemas/check-point.schema';
import { Escrow } from '../evaluation/schemas/escrow.schema';
import { CheckPointService } from './check-point.service';
import { CreateCheckPointInput } from './dtos/create-check-point-input.dto';
import { GetCheckPointListInput } from './dtos/get-checkpoint-list-input.dto';
import { GetSignatureInput } from './dtos/get-signature-input.dto';

@Controller('check-point')
@ApiTags('Check Point API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CheckPointController {
  constructor(private readonly checkPointService: CheckPointService) { }

  @Post('get-signature')
  @ApiOperation({
    description: 'Get Signature for create CheckPoint API'
  })
  async getSignature(@ReqContext() ctx: RequestContext, @Body() input: GetSignatureInput): Promise<BaseApiResponse<string>> {
    const res = await this.checkPointService.getSignature(ctx, input.evaluation_id, input.base64_serialized_tx);
    return {
      data: res,
      meta: {}
    }
  }

  @Get('')
  @ApiOperation({
    description: 'List CheckPoint API'
  })
  async getCheckPointList(@ReqContext() ctx: RequestContext, @Query() input: GetCheckPointListInput): Promise<BaseApiResponse<CheckPoint[]>> {
    const checkpoints = await this.checkPointService.getListCheckPoint(ctx, input.evaluation_id);
    return {
      data: checkpoints,
      meta: {}
    }
  }

  @Post('')
  @ApiOperation({
    description: 'Create CheckPoint API'
  })
  async createCheckPoint(@ReqContext() ctx: RequestContext, @Body() input: CreateCheckPointInput): Promise<BaseApiResponse<CheckPoint>> {
    const checkpoint = await this.checkPointService.createCheckPoint(ctx, input);
    return {
      data: checkpoint,
      meta: {}
    }
  }

  @Get(':locker/escrow')
  @ApiOperation({
    description: 'List escrow API'
  })
  async getListEscrow(@ReqContext() ctx: RequestContext, @Param('locker') locker: string): Promise<BaseApiResponse<Escrow[]>> {
    const escrows = await this.checkPointService.getListEscrow(ctx, locker);
    return {
      data: escrows,
      meta: {}
    }
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get check point by id'
  })
  async getCheckpointById(@ReqContext() ctx: RequestContext, @Param('id') id: string): Promise<BaseApiResponse<CheckPoint>> {
    const checkpoint = await this.checkPointService.getCheckpointById(ctx, id);
    return {
      data: checkpoint,
      meta: {}
    }
  }
}
