import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivityHistory, ActivityHistorySchema } from 'src/modules/activity-history/schemas/activity-history.schema';
import { ExitEscrowEvent } from 'src/modules/cronjobs/models/ExitEscrowEvent';
import { CronjobConfig, CronjobConfigSchema } from 'src/modules/cronjobs/schemas/config.schema';
import { Signature, SignatureSchema } from 'src/modules/cronjobs/schemas/signature.schema';
import { TransactionSchema } from 'src/modules/cronjobs/schemas/transaction.schema';
import { CheckPoint, CheckPointSchema } from 'src/modules/evaluation/schemas/check-point.schema';
import { Distribution, DistributionSchema } from 'src/modules/evaluation/schemas/distribution.schema';
import { Escrow, EscrowSchema } from 'src/modules/evaluation/schemas/escrow.schema';
import { ExitEscrowEventSchema } from 'src/modules/evaluation/schemas/exit-escrow-event.schema';
import { LockEvent, LockEventSchema } from 'src/modules/evaluation/schemas/lock-event.schema';
import { Evaluation, EvaluationSchema } from 'src/modules/evaluation/schemas/main.schema';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';
import { Transaction } from 'typeorm';

import { configModuleOptions } from './configs/module-options';
import { QUEUE_NAME } from './constants';
import { DatabaseModule } from './database/database.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppLoggerModule } from './logger/logger.module';
@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    DatabaseModule,
    AppLoggerModule,
    BullModule.registerQueue({
      name: QUEUE_NAME.SOCKET,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: CronjobConfig.name, schema: CronjobConfigSchema },
      { name: Signature.name, schema: SignatureSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Evaluation.name, schema: EvaluationSchema },
      { name: Distribution.name, schema: DistributionSchema },
      { name: Escrow.name, schema: EscrowSchema },
      { name: LockEvent.name, schema: LockEventSchema },
      { name: User.name, schema: UserSchema },
      { name: CheckPoint.name, schema: CheckPointSchema },
      { name: ExitEscrowEvent.name, schema: ExitEscrowEventSchema },
      { name: ActivityHistory.name, schema: ActivityHistorySchema },
    ]),
  ],
  exports: [
    AppLoggerModule,
    ConfigModule,
    DatabaseModule,
    MongooseModule
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule { }
