import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ErrorCode } from 'src/shared/constants/error-code';
import { ExceptionFactory } from 'src/shared/factories/exception.factory';

import { UserService } from '../../modules/user/services/user.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { AuthTokenOutput, LoginOutput, UserAccessTokenClaims } from '../dtos/auth-token-output.dto';
import { RegisterInput } from '../dtos/register-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService, 
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService

  ) {
    this.logger.setContext(AuthService.name);
  }

    async validateUser(
      ctx: RequestContext,
      username: string,
      pass: string,
    ): Promise<UserAccessTokenClaims> {
      this.logger.log(ctx, `${this.validateUser.name} was called`);

      // The userService will throw Unauthorized in case of invalid username/password.
      const user = await this.userService.validateUsernamePassword(
        ctx,
        username,
        pass,
      );

      return user;
    }

  getAuthToken(
    user: UserAccessTokenClaims,
  ): AuthTokenOutput {

    const payload = {
      email: user.email,
      id: user.id
    };

    const authToken = {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    };
    return plainToInstance(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }


  async login(ctx: RequestContext, input: LoginInput): Promise<LoginOutput> {
    const user = await this.userService.findUserByEmail(input.email);
    const token_info = await this.getAuthToken({
      id: user._id,
      email: user.email
    });
    return plainToInstance(LoginOutput, {
      ...token_info,
      user: {
        wallet_address: user.wallet_address,
        email: user.email
      }
    })
  }

  async register(input: RegisterInput): Promise<RegisterOutput> {
    const exist_user = await this.userService.findUserByEmail(input.email);
    if (exist_user) {
      throw ExceptionFactory.create(ErrorCode.EMAIL_ALREADY_USED)
    }
    input.password = await hash(input.password, 10);
    input.wallet_address = "";
    const user = await this.userService.createUser(input);
    return user;
  }

  //   async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
  //     this.logger.log(ctx, `${this.refreshToken.name} was called`);

  //     const user = await this.userService.findById(ctx, ctx.user.id);
  //     if (!user) {
  //       throw ExceptionFactory.create(ErrorCode.USER_ID_NOT_FOUND);
  //     }

  //     return this.getAuthToken(ctx, user);
  //   }

  //   async updateUserAuthToken(
  //     userId: number,
  //     refreshToken: string,
  //     accessToken: string,
  //   ): Promise<void> {
  //     let authToken = await this.authTokenRepository.findByColumn(
  //       'userId',
  //       userId,
  //     );
  //     if (authToken) {
  //       authToken.accessToken = accessToken;
  //       authToken.refreshToken = refreshToken;
  //     } else {
  //       authToken = plainToClass(AuthToken, {
  //         userId,
  //         accessToken,
  //         refreshToken,
  //       });
  //     }

  //     await this.authTokenRepository.save(authToken);
  //   }

  //   async getAuthToken(
  //     ctx: RequestContext,
  //     user: UserAccessTokenClaims | UserOutput,
  //   ): Promise<AuthTokenOutput> {
  //     this.logger.log(ctx, `${this.getAuthToken.name} was called`);

  //     const subject = { sub: user.id };
  //     const payload = {
  //       username: user.username,
  //       sub: user.id,
  //       roles: user.roles,
  //     };

  //     const authToken = {
  //       refreshToken: this.jwtService.sign(subject, {
  //         expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
  //       }),
  //       accessToken: this.jwtService.sign(
  //         { ...payload, ...subject },
  //         { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
  //       ),
  //     };

  //     await this.updateUserAuthToken(
  //       user.id,
  //       authToken.refreshToken,
  //       authToken.accessToken,
  //     );

  //     return plainToClass(AuthTokenOutput, authToken, {
  //       excludeExtraneousValues: true,
  //     });
  //   }

  //   async validateToken(token: string): Promise<{
  //     success: boolean;
  //     user: Partial<User>;
  //   }> {
  //     const jwtPayload = this.jwtService.verify(token);
  //     const user = await this.userRepository.findByColumn('id', jwtPayload.sub);
  //     return {
  //       success: !!user,
  //       user,
  //     };
  //   }

  //   async logout(ctx: RequestContext): Promise<boolean> {
  //     this.logger.log(ctx, `${this.logout.name} was called`);
  //     await this.updateUserAuthToken(+ctx.user.id, '', '');

  //     return true;
  //   }
}
