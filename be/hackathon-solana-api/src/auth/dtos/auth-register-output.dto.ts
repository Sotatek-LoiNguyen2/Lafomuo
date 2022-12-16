import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegisterOutput {
  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  wallet_address: string;

  @ApiProperty()
  @Expose()
  created_at: Date;
}
