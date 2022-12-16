import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { Evaluation, EvaluationSchema } from '../evaluation/schemas/main.schema';
import { CronsController } from './crons.controller';
import { CronsService } from './crons.service';

@Module({
  controllers: [CronsController],
  providers: [CronsService],
  imports: [HttpModule, MongooseModule.forFeatureAsync([{
    name: Evaluation.name, useFactory: async (connection: Connection) => {
      const schema = EvaluationSchema;
      const AutoIncrement = require('mongoose-sequence')(connection);
      schema.plugin(AutoIncrement, { inc_field: 'ID' });
      return schema;
    },
    inject: [getConnectionToken()]
  }]),]
})
export class CronsModule {}
