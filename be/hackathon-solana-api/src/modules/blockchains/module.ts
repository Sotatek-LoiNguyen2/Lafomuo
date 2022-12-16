import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema} from '../evaluation/schemas/main.schema';
import { EvaluationService } from '../evaluation/services/main.service';
import { Connection } from 'mongoose';
import { FractionalizeController } from './controllers/fractionalize.controller';
import { MintController } from './controllers/mint.controller';
import { FractionalizeService } from './services/fractionalize.service';
import { MintService } from './services/mint.service';
import { UserService } from '../user/services/user.service';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [ConfigModule.forRoot(),
    MongooseModule.forFeatureAsync([{
      name: Evaluation.name, useFactory: async (connection: Connection) => {
        const schema = EvaluationSchema;
        const AutoIncrement = require('mongoose-sequence')(connection);
        schema.plugin(AutoIncrement, { inc_field: 'ID' });
        return schema;
      },
      inject: [getConnectionToken()]
    }]),
    MongooseModule.forFeatureAsync([{
      name: User.name, useFactory: async (connection: Connection) => {
        const schema = UserSchema;
        const AutoIncrement = require('mongoose-sequence')(connection);
        // schema.plugin(AutoIncrement, { inc_field: 'ID' });
        return schema;
      },
      inject: [getConnectionToken()]
    }])],
  controllers: [MintController, FractionalizeController],
  providers: [MintService, FractionalizeService, EvaluationService, UserService]
})
export class BlockchainsModule {}
