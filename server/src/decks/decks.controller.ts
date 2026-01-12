import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { DecksService } from './decks.service';
import { CreateDeckDto, UpdateDeckDto } from './dto/deck.dto';

@UseGuards(JwtAuthGuard)
@Controller('decks')
export class DecksController {
    constructor(private readonly decksService: DecksService) { }

    @Get()
    getAll(@CurrentUser() userId: string, @Query('q') q?: string) {
        return this.decksService.getAll(userId, q);
    }

    @Get('summary')
    summary(@CurrentUser() userId: string, @Query('q') q?: string) {
        return this.decksService.summary(userId, q);
    }

    @Get(':id')
    findById(@CurrentUser() userId: string, @Param('id') id: string) {
        return this.decksService.findById(userId, id);
    }

    @Post()
    create(@CurrentUser() userId: string, @Body() dto: CreateDeckDto) {
        return this.decksService.create(userId, dto);
    }

    @Patch(':id')
    update(
        @CurrentUser() userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateDeckDto,
    ) {
        return this.decksService.update(userId, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@CurrentUser() userId: string, @Param('id') id: string) {
        return this.decksService.delete(userId, id);
    }
}
