import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { StatsService } from './stats.service';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('overview')
    getOverview(@CurrentUser() userId: string) {
        return this.statsService.getOverview(userId);
    }

    @Get('heatmap')
    getHeatmap(@CurrentUser() userId: string) {
        return this.statsService.getHeatmap(userId);
    }

    @Get('daily')
    getDaily(
        @CurrentUser() userId: string,
        @Query('days') days?: string,
    ) {
        return this.statsService.getDaily(userId, days ? parseInt(days, 10) : 30);
    }

    @Get('decks')
    getDeckStats(@CurrentUser() userId: string) {
        return this.statsService.getDeckStats(userId);
    }
}
