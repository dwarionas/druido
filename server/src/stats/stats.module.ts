import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
    imports: [PrismaModule],
    providers: [StatsService],
    controllers: [StatsController],
    exports: [StatsService],
})
export class StatsModule { }
