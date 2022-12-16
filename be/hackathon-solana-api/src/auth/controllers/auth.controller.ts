import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerCommonResponse } from 'src/shared/decorators/response-swagger.decorator';

import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { HEADER_KEY } from '../constants/strategy.constant';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { AuthTokenOutput, LoginOutput } from '../dtos/auth-token-output.dto';
import { RegisterInput } from '../dtos/register-input.dto';
import { AuthHeaderApiKeyGuard } from '../guards/header-api-key-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
@ApiSecurity(HEADER_KEY.API_KEY)
@UseGuards(AuthHeaderApiKeyGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @SwaggerCommonResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(LoginOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  async login(
    @ReqContext() ctx: RequestContext,
    @Body() input: LoginInput,
  ): Promise<BaseApiResponse<LoginOutput | any>> {
    const data = await this.authService.login(ctx, input);
    return { data, meta: {} };
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register API'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(RegisterOutput),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: BaseApiErrorResponse,
  })
  async register(
    @Body() input: RegisterInput,
  ): Promise<BaseApiResponse<RegisterOutput>> {
    const user = await this.authService.register(input);
    return {
      data: user,
      meta: {}
    };
  }

}
