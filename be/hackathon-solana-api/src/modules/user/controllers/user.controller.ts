/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { AppLogger } from 'src/shared/logger/logger.service';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';

import { CreateUserInput } from '../dtos/create-user.dto';
import { UpdateWalletAddressInput } from '../dtos/update-wallet-address-input.dto';
import { UserService } from '../services/user.service';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(UserController.name);
  }

  @Post('update-wallet-address')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateWalletAddress(@Body() input: UpdateWalletAddressInput, @ReqContext() ctx: RequestContext): Promise<BaseApiResponse<{}>> {
    await this.userService.updateWalletAddress(ctx, input);
    return {
      data: {},
      meta: {}
    }
  }
}
