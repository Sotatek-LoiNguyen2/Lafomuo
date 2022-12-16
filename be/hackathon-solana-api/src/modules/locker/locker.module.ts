import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { LockerController } from './locker.controller';
import { LockerService } from './locker.service';

@Module({
    controllers: [LockerController],
    providers: [LockerService],
    imports: [SharedModule]
})
export class LockerModule {}