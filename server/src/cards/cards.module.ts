import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { StatsModule } from '../stats/stats.module';

@Module({
    imports: [StatsModule],
    providers: [CardsService],
    controllers: [CardsController],
})
export class CardsModule { }
