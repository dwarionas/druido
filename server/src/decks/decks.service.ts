import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto, UpdateDeckDto } from './dto/deck.dto';

@Injectable()
export class DecksService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(userId: string, q?: string) {
        const where: any = { userId };
        if (q) {
            where.name = { contains: q, mode: 'insensitive' };
        }

        return this.prisma.deck.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
        });
    }

    async summary(userId: string, q?: string) {
        const where: any = { userId };
        if (q) {
            where.name = { contains: q, mode: 'insensitive' };
        }

        const decks = await this.prisma.deck.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: { select: { cards: true } },
            },
        });

        // TODO: this is kinda slow, maybe move to a raw query later
        const now = new Date();
        const dueCounts = await Promise.all(
            decks.map((deck) =>
                this.prisma.card.count({
                    where: { deckId: deck.id, userId, due: { lte: now } },
                }),
            ),
        );

        return decks.map((deck, i) => ({
            id: deck.id,
            name: deck.name,
            description: deck.description,
            language: deck.language,
            tags: deck.tags,
            totalCards: deck._count.cards,
            dueCards: dueCounts[i],
            createdAt: deck.createdAt,
            updatedAt: deck.updatedAt,
        }));
    }

    async findById(userId: string, id: string) {
        const deck = await this.prisma.deck.findFirst({
            where: { id, userId },
        });
        if (!deck) throw new NotFoundException();
        return deck;
    }

    async create(userId: string, dto: CreateDeckDto) {
        return this.prisma.deck.create({
            data: {
                userId,
                name: dto.name,
                description: dto.description,
                language: (dto.language as Language) || 'UK',
                tags: dto.tags || [],
            },
        });
    }

    async update(userId: string, id: string, dto: UpdateDeckDto) {
        // make sure it belongs to user first
        await this.findById(userId, id);

        return this.prisma.deck.update({
            where: { id },
            data: {
                ...dto,
                language: dto.language ? (dto.language as Language) : undefined,
            },
        });
    }

    async delete(userId: string, id: string) {
        await this.findById(userId, id);
        await this.prisma.deck.delete({ where: { id } });
    }
}
