# Druido

Spaced repetition app for language learners. Uses the [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) scheduling algorithm instead of the traditional SM-2 approach, providing more accurate review intervals based on individual memory patterns.

## Demo

The fastest way to try it:

```bash
docker compose up -d
cd server && cp .env.example .env && npm i && npx prisma migrate dev && npm run start:dev
cd client && npm i && npm run dev
```

Open `http://localhost:8000` and click **Try Demo** — a pre-seeded deck with 900+ Ukrainian→German flashcards will be created automatically.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | NestJS 11, Prisma 6, PostgreSQL 16 |
| Auth | Passport JWT, cookie-based sessions, bcrypt |
| SRS Engine | ts-fsrs (FSRS v5) on both client preview and server persistence |
| Infra | Docker Compose |

## Features

- FSRS-based spaced repetition with real-time schedule preview
- Keyboard shortcuts during review (Space to flip, 1–4 to rate)
- Deck management with color coding and tag filtering
- CSV and Anki (.apkg) import/export
- Global search across decks and cards
- Activity heatmap, daily review charts, per-deck mastery tracking
- Achievement system (streaks, XP milestones, deck mastery)
- i18n support (Ukrainian, English, German)
- Dark mode UI with glassmorphism design

## Architecture

```
druido/
├── client/             Next.js frontend
│   ├── app/            Pages and layouts (App Router)
│   ├── components/     UI components (shadcn + custom)
│   ├── hooks/          useAuth, useFSRS
│   └── lib/            API client, i18n, APKG parser, utils
├── server/             NestJS backend
│   ├── src/
│   │   ├── auth/       JWT auth (register, login, demo mode)
│   │   ├── decks/      Deck CRUD
│   │   ├── cards/      Card CRUD + FSRS scheduling
│   │   └── stats/      Review tracking, heatmap, streaks
│   └── prisma/         Schema, migrations, demo seed
└── docker-compose.yml  PostgreSQL
```

## License

MIT
