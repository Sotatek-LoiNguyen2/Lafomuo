import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthTokenOutput {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}

export class UserInfo {
  @ApiProperty()
  @Expose()
  wallet_address: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class LoginOutput extends AuthTokenOutput {
  @ApiProperty()
  @Expose()
  user: UserInfo
}

export class UserAccessTokenClaims {
  @Expose()
  id: string;

  @Expose()
  email: string;
}

export class UserRefreshTokenClaims {
  id: number;
}
