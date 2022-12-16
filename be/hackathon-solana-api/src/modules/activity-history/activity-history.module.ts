import { Module } from '@nestjs/common';
import { ActivityHistoryService } from './activity-history.service';
import { ActivityHistoryController } from './activity-history.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [ActivityHistoryController],
  providers: [ActivityHistoryService],
  imports: [SharedModule]
})
export class ActivityHistoryModule {}
