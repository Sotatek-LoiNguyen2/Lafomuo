import { Module } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { SharedModule } from '../../shared/shared.module';
import { EvaluationController } from './controllers/main.controller';
import { Evaluation, EvaluationSchema } from './schemas/main.schema';
import { EvaluationService } from './services/main.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: Evaluation.name, useFactory: async (connection: Connection) => {
        const schema = EvaluationSchema;
        const AutoIncrement = require('mongoose-sequence')(connection);
        schema.plugin(AutoIncrement, { inc_field: 'ID' });
        return schema;
      },
      inject: [getConnectionToken()]
    }]),
    SharedModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule { }
