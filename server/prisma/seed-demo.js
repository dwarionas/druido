"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemoUser = seedDemoUser;
exports.resetDemoUser = resetDemoUser;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ts_fsrs_1 = require("ts-fsrs");
const DEMO_EMAIL = 'demo@druido.app';
const DEMO_PASSWORD = 'demo1234';
const DEMO_NAME = 'Demo';
const BCRYPT_ROUNDS = 12;
async function seedDemoUser(prisma) {
    const existing = await prisma.user.findUnique({
        where: { email: DEMO_EMAIL },
        include: { decks: true },
    });
    if (existing && existing.decks.length > 0) {
        return existing;
    }
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);
    const user = existing ?? await prisma.user.create({
        data: {
            email: DEMO_EMAIL,
            passwordHash,
            name: DEMO_NAME,
            xp: 1250,
            streak: 7,
            dailyGoal: 20,
            lastStudiedAt: new Date(),
        },
    });
    const deck = await prisma.deck.create({
        data: {
            userId: user.id,
            name: 'Deutsch B2–C1',
            description: 'Українсько-німецькі картки для рівнів B2–C1',
            language: 'DE',
            color: 'green',
            tags: ['deutsch', 'b2', 'c1', 'vocabulary'],
        },
    });
    const cardsPath = path.join(__dirname, 'demo-cards.json');
    const raw = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));
    const emptyCard = (0, ts_fsrs_1.createEmptyCard)(new Date());
    const data = raw.map((c) => ({
        userId: user.id,
        deckId: deck.id,
        question: c.question,
        answer: c.answer,
        tags: [],
        stability: emptyCard.stability,
        difficulty: emptyCard.difficulty,
        elapsedDays: emptyCard.elapsed_days,
        scheduledDays: emptyCard.scheduled_days,
        reps: emptyCard.reps,
        lapses: emptyCard.lapses,
        state: emptyCard.state,
        due: emptyCard.due,
    }));
    await prisma.card.createMany({ data });
    await seedStudySessions(prisma, user.id);
    return user;
}
async function seedStudySessions(prisma, userId) {
    const sessions = [];
    const now = new Date();
    for (let i = 45; i >= 0; i--) {
        if (Math.random() < 0.3)
            continue;
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const cardsReviewed = Math.floor(Math.random() * 25) + 5;
        const xpEarned = cardsReviewed * 10;
        sessions.push({
            userId,
            date,
            cardsReviewed,
            xpEarned,
        });
    }
    for (const session of sessions) {
        await prisma.studySession.upsert({
            where: { userId_date: { userId, date: session.date } },
            create: session,
            update: {},
        });
    }
}
async function resetDemoUser(prisma) {
    const user = await prisma.user.findUnique({
        where: { email: DEMO_EMAIL },
    });
    if (user) {
        await prisma.studySession.deleteMany({ where: { userId: user.id } });
        await prisma.card.deleteMany({ where: { userId: user.id } });
        await prisma.deck.deleteMany({ where: { userId: user.id } });
        await prisma.user.delete({ where: { id: user.id } });
    }
    return seedDemoUser(prisma);
}
if (require.main === module) {
    const prisma = new client_1.PrismaClient();
    seedDemoUser(prisma)
        .then((user) => {
        console.log(`Demo user seeded: ${user.email} (${user.id})`);
    })
        .catch(console.error)
        .finally(() => prisma.$disconnect());
}
//# sourceMappingURL=seed-demo.js.map