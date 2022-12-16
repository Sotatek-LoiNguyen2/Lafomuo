import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateEvalatorInput {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  // @IsNotEmpty()
  nftName: string;

  @IsString()
  // @IsNotEmpty()
  phone: string;

  @IsString()
  // @IsNotEmpty()
  email: string;

  @IsString()
  description: string;

  @IsObject()
  @IsNotEmpty()
  avatar: {
    name: string,
    data: string,
  };

  @IsString()
  image: string;

  @IsString()
  externalUrl: string;

  @IsString()
  youtubeUrl: string;

  @IsString()
  @IsArray()
  attributes: [{
    name: string,
    data: string,
  }]

  @IsArray()
  @IsNotEmpty()
  certificates: [{
    name: string,
    data: string,
  }];

  @IsArray()
  @IsNotEmpty()
  projectImages: [{
    name: string,
    data: string,
  }];
}

export class UpdateEvalatorInput extends CreateEvalatorInput {
  @IsObject()
  @IsNotEmpty()
  avatar: {
    name: string,
    data: string,
    url: string,
  };

  @IsArray()
  @IsNotEmpty()
  certificates: [{
    name: string,
    data: string,
    url: string,
  }];

  @IsArray()
  @IsNotEmpty()
  projectImages: [{
    name: string,
    data: string,
    url: string,
  }];

  @ApiPropertyOptional()
  @IsOptional()
  assetMetadata: string;
}
export class TokenizeEvalatorInput {
  @IsString()
  @IsNotEmpty()
  tokenName: string;

  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @IsNumber()
  @IsNotEmpty()
  tokenSupply: number;
}
