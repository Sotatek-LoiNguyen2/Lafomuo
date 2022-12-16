import { IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  wallet_address: string;
}
