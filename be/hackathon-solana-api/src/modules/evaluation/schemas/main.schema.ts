import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { EVALUATION_STATUS } from 'src/shared/constants';

export type EvaluationDocument = HydratedDocument<Evaluation>;
const options = {
  timestamps: true,
  _id: true,
  autoIndex: true,
};

@Schema()
export class FileSchema {
  name: string;
  url: string;
  path: string;
};

@Schema()
export class AttributeSchema {
  key: string;
  value: string;
};

@Schema()
export class AssetFractionalize {
  assetBasket: string;
  governor: string;
  mint: string;
  owner: string;
  totalSupply: string
}

@Schema(options)
export class Evaluation extends Document {

  @Prop()
  ID: number;

  @Prop()
  nftName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User

  @Prop()
  address: string;

  @Prop()
  assetValue: number;

  @Prop()
  avatar: FileSchema

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  externalUrl: string;

  @Prop()
  animationUrl: string;

  @Prop()
  youtubeUrl: string;

  @Prop()
  attributes: [AttributeSchema];

  @Prop()
  projectImages: [FileSchema];

  @Prop()
  certificates: [FileSchema];

  @Prop()
  tokenName: string;

  @Prop()
  tokenSymbol: string;

  @Prop()
  tokenAddress: string;

  @Prop({ default: 'solana' })
  chain: string;

  @Prop()
  tokenSupply: number;

  @Prop()
  tokenListingPrice: number;

  @Prop()
  tokenListingDate: Date;

  @Prop()
  totalTokenRemain: number;

  @Prop()
  claimRewardDate: Date;

  @Prop()
  rewardMonthly: number;

  @Prop()
  assetMetadata: string;

  @Prop()
  mintKey: string;

  @Prop()
  assetBasket: string;

  @Prop()
  basket_id: string;

  @Prop()
  assetFractionalize: AssetFractionalize;

  @Prop({ default: 'https://basc.s3.amazonaws.com/meta/3506.json' })
  assetUrl: string;

  @Prop({ default: '8CmfvdfpbJ1atkm8ruqBG5JurgxKqAseYduDWdEiMNpX' })
  bigGuardian: string;

  @Prop({
    enum: EVALUATION_STATUS,
    default: EVALUATION_STATUS.PASSED
  })
  status: EVALUATION_STATUS

  @Prop({ index: true, default: null })
  deleteAt: Date;
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);
