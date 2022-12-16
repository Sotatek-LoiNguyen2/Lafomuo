import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as anchor from '@project-serum/anchor';
import { compare } from 'bcrypt';
import * as base64 from 'byte-base64';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { UserAccessTokenClaims, UserInfo } from 'src/auth/dtos/auth-token-output.dto';
import { ErrorCode } from 'src/shared/constants/error-code';
import { ExceptionFactory } from 'src/shared/factories/exception.factory';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import nacl from 'tweetnacl';
import pkg from 'tweetnacl-util';

import { CreateUserInput } from '../dtos/create-user.dto';
import { UpdateWalletAddressInput } from '../dtos/update-wallet-address-input.dto';
import { User, UserDocument } from '../schemas/user.schema';
const { decodeUTF8 } = pkg;
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const createdUser = new this.userModel(input);
    return await createdUser.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async validateUsernamePassword(
    ctx: RequestContext,
    email: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw ExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }

    const match = await compare(pass, user.password);
    if (!match) {
      throw ExceptionFactory.create(ErrorCode.PASSWORD_NOT_CORRECT)
    }

    return plainToInstance(UserAccessTokenClaims, {
      email: user.email,
      id: user._id
    });
  }

  async updateWalletAddress(ctx: RequestContext, input: UpdateWalletAddressInput): Promise<UserInfo> {
    const user = await this.findUserByEmail(ctx.user.email);

    const message = 'solana-coding-camp';
    const messageBytes = decodeUTF8(message);

    const verifyMessage = base64.base64ToBytes(input.message);
    const userPubkey = new anchor.web3.PublicKey(input.wallet_address);
    try {
      const check = nacl.sign.detached.verify(
        messageBytes,
        verifyMessage,
        userPubkey.toBytes(),
      );
      if (check) {
        await this.userModel.findOneAndUpdate({ email: user.email }, {
          wallet_address: input.wallet_address
        });
        return {
          email: user.email,
          wallet_address: input.wallet_address
        }
      } else {
        throw ExceptionFactory.create(ErrorCode.INVALID_SIGNATURE)
      }
    } catch (error) {
      throw ExceptionFactory.create(ErrorCode.INVALID_SIGNATURE)
    }

  }

  async findUserById(id: string){
    return await this.userModel.findById(id);
  }
}
