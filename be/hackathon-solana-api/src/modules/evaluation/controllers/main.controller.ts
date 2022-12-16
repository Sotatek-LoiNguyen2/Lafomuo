import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AppLogger } from "src/shared/logger/logger.service";
import { ReqContext } from "src/shared/request-context/req-context.decorator";
import { RequestContext } from "src/shared/request-context/request-context.dto";

import { GetListAssetInput } from "../dtos/get-list-asset-input.dto";
import { UpdateAssetMetaData } from "../dtos/update-asset-metadata-input.dto";
import { EvaluationService } from "../services/main.service";

@Controller('evaluations')
@ApiTags('Evaluation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class EvaluationController {
  constructor(
    private readonly logger: AppLogger,
    private readonly service: EvaluationService,
  ) {
    this.logger.setContext(EvaluationController.name);
  }

  @Get('/')
  async getAll(
    @ReqContext() ctx: RequestContext,
    @Query() input: GetListAssetInput
  ): Promise<any> {
    this.logger.log(ctx, `get all ${this.update.name} was called`);
    const result = await this.service.getAll(ctx, input);
    return result;
  }

  @Get('/owner/')
  async getAllByOwner(
    @ReqContext() ctx: RequestContext,
    @Query() input: GetListAssetInput
  ): Promise<any> {
    this.logger.log(ctx, `get all ${this.update.name} was called`);
    const result = await this.service.getAllByOwner(ctx, input);
    return result;
  }

  @Post()
  async create(
    @ReqContext() ctx: RequestContext,
    @Body() data: any,
  ): Promise<any> {
    this.logger.log(ctx, `create ${this.create.name} was called`);
    const result = await this.service.create(ctx, data);
    return result;
  }

  @Get('/:id')
  async get(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<any> {
    this.logger.log(ctx, `get ${this.update.name} was called`);
    const result = await this.service.get(ctx, id);
    return result;
  }

  @Put('/:id')
  async update(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<any> {
    this.logger.log(ctx, `update ${this.update.name} was called`);
    const result = await this.service.update(ctx, id, data);
    return result;
  }

  @Delete('/:id')
  async softDelete(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
  ): Promise<any> {
    this.logger.log(ctx, `delete ${this.update.name} was called`);
    const result = await this.service.softDelete(ctx, id);
    return result;
  }

  @Put('/:id/tokenize')
  async generateToken(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<any> {
    this.logger.log(ctx, `generate token ${this.update.name} was called`);
    const result = await this.service.generateToken(ctx, id, data);
    return result;
  }

  @Put('/:id/assetMetadata')
  async updateAssetMetadata(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: string,
    @Body() data: UpdateAssetMetaData,
  ): Promise<any> {
    this.logger.log(ctx, `generate token ${this.update.name} was called`);
    const result = await this.service.updateAssetMetaData(ctx, id, data);
    return result;
  }
}
