import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { ReqContext } from 'src/shared/request-context/req-context.decorator';
import { RequestContext } from 'src/shared/request-context/request-context.dto';
import { ActivityHistoryService } from './activity-history.service';
import { ActivityHistory} from './schemas/activity-history.schema'

@Controller('activity-history')
@ApiTags('Activity History API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ActivityHistoryController {
  constructor(private readonly activityHistoryService: ActivityHistoryService) {}

  @Get(':locker')
  @ApiOperation({
    description: 'List activity history'
  })
  async getActivityHistoryByLocker(@ReqContext() ctx: RequestContext, @Param('locker') locker: string): Promise<BaseApiResponse<ActivityHistory[]>>{
    const res = await this.activityHistoryService.getActivityHistoryByLocker(ctx, locker);
    return {
      data: res,
      meta: {}
    }
  }
}
