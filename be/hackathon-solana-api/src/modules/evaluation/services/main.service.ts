import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { FileUtils } from 'src/shared/utils/FileUtils';

import { GetListAssetInput } from '../dtos/get-list-asset-input.dto';
import { CreateEvalatorInput, TokenizeEvalatorInput, UpdateEvalatorInput } from '../dtos/main.dto';
import { UpdateAssetMetaData } from '../dtos/update-asset-metadata-input.dto';
import { Evaluation, EvaluationDocument } from '../schemas/main.schema';
@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name) private evaluationModel: Model<EvaluationDocument>,
    private readonly config: ConfigService
  ) { }

  async getAllByOwner(ctx: RequestContext, input: GetListAssetInput): Promise<Evaluation[]> {
    const obj: any = {
      owner: ctx.user?.id, deleteAt: null
    }
    if (input.status) {
      obj.status = input.status
    }
    return this.evaluationModel.find({ ...obj }).sort({ _id: -1 }).limit(input.page_size).skip(input.page_number * input.page_size);
  }

  async getAll(ctx: RequestContext, input: GetListAssetInput): Promise<Evaluation[]> {
    const obj: any = {
      deleteAt: null
    }
    if (input.status) {
      obj.status = input.status
    }
    return this.evaluationModel.find({ ...obj }).sort({ _id: -1 }).limit(input.page_size).skip(input.page_number * input.page_size);
  }

  async softDelete(ctx: RequestContext, id: string): Promise<Evaluation> {
    return await this.evaluationModel.findOneAndUpdate({ _id: id, owner: ctx.user.id }, { deleteAt: new Date() });
  }

  async processFile(data: CreateEvalatorInput): Promise<void> {
    const file = await FileUtils.saveFile(data.avatar, this.config);
    if (file)
      data.avatar = file;
    const projectImages = data.projectImages || [];
    for (let index = 0; index < projectImages.length; index++) {
      const element = projectImages[index];
      if (!element)
        continue;
      console.log('element: ', element);
      projectImages[index] = await FileUtils.saveFile(element, this.config);
    }
    const certificates = data.certificates || [];
    for (let index = 0; index < certificates.length; index++) {
      const element = certificates[index];
      if (!element)
        continue;
      certificates[index] = await FileUtils.saveFile(element, this.config);
    }
  }

  async create(ctx: RequestContext, data: CreateEvalatorInput): Promise<Evaluation> {
    await this.processFile(data);
    const evalator = new this.evaluationModel({ ...data, owner: ctx.user?.id });
    const rs = await evalator.save();
    await this.toFile(rs._id);
    return rs;
  }

  async getByOwner(ctx: RequestContext, id: string): Promise<Evaluation> {
    return this.evaluationModel.findOne({ _id: id, owner: ctx.user?.id });
  }

  async get(ctx: RequestContext, id: string): Promise<Evaluation> {
    return this.evaluationModel.findOne({ _id: id});
  }

  async update(ctx: RequestContext, id: string, data: UpdateEvalatorInput): Promise<Evaluation> {
    await this.processFile(data);
    const rs = await this.evaluationModel.findOneAndUpdate({ _id: id, owner: ctx.user?.id }, data);
    await this.toFile(rs._id);
    return rs;
  }

  async generateToken(ctx: RequestContext, id: string, data: TokenizeEvalatorInput): Promise<Evaluation> {
    const rs = await this.evaluationModel.findOneAndUpdate({ _id: id, owner: ctx.user?.id }, { ...data }, { returnNewDocument: true });
    await this.toFile(rs._id);
    return rs;
  }

  async updateAssetMetaData(ctx: RequestContext, id: string, data: UpdateAssetMetaData): Promise<Evaluation> {
    return this.evaluationModel.findOneAndUpdate({ _id: id }, { ...data });
  }

  async toFile(_id: string) {
    const evaluation = await this.evaluationModel.findById(_id);
    if (!evaluation) {
      return;
    }

    const dir = `${this.config.get('storeConfig.path')}/meta/`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const image = `${this.config.get('storeConfig.host', 'http://localhost:3000')}${`${this.config.get('storeConfig.host', 'http://localhost:3000').endsWith('/') ? '' : '/'}${evaluation.avatar.url}`.replace(/\/+/, '/')}`;
    const data = {
      name: evaluation.tokenName || evaluation.nftName,
      symbol: evaluation.tokenSymbol || 'LAFOMUORE',
      description: evaluation.description,
      seller_fee_basis_points: 0,
      image,
      external_url: evaluation.externalUrl,
      edition: evaluation.ID,
      attributes: [],
      properties: {
        creators: [{
          address: evaluation.bigGuardian,
          share: 100,
        }],
        files: [{
          uri: image,
          type: 'image/png',
        }],
      },
      collection: {
        "name": "Bored Ape Solana Club",
        "family": "BASC",
      },
    };
    for (const attr of evaluation.attributes) {
      const item = { trait_type: attr.key, value: attr.value };
      data.attributes.push(item);
    }
    const path = `${dir}/${_id}.json`;
    fs.writeFileSync(path, JSON.stringify(data));
    const url = `/${path.replace(this.config.get('storeConfig.path'), this.config.get('storeConfig.url', ''))}`.replace(/\/+/, '/');
    await this.evaluationModel.findByIdAndUpdate(_id, { assetUrl: `${this.config.get('storeConfig.host', 'http://localhost:3000')}${url}` })
    // return { path, url, name: request.name, host: config.get('storeConfig.host', 'http://localhost:3000') };
  }
}
