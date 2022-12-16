import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

import { EvaluationService } from '../evaluation/services/main.service';
import { UserService } from '../user/services/user.service';
import { CheckPointController } from './check-point.controller';
import { CheckPointService } from './check-point.service';

@Module({
  controllers: [CheckPointController],
  providers: [CheckPointService, EvaluationService, UserService],
  imports: [SharedModule]
})
export class CheckPointModule {}
