# Druido

A spaced repetition app for language learners, built with Next.js and NestJS.

Uses the [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) algorithm for optimal review scheduling instead of the older SM-2 approach.

## Stack

**Client** — Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui  
**Server** — NestJS, Prisma, PostgreSQL, Passport JWT  
**Infra** — Docker, Docker Compose

## Features

- Cookie-based JWT authentication (register, login, logout)
- Create and manage flashcard decks with descriptions and tags
- Add cards with question/answer pairs and optional tags
- FSRS-based spaced repetition with schedule preview
- Keyboard shortcuts during review (Space to flip, 1-4 to rate)
- CSV import and export
- Tag filtering in card list
- Global search across decks and cards
- i18n support (Ukrainian, English, German)
- Dark mode

## Getting started

```bash
# start postgres
docker compose up -d

# server
cd server
cp .env.example .env   # edit DATABASE_URL + JWT_SECRET
npm install
npx prisma migrate dev
npm run start:dev

# client
cd client
npm install
npm run dev
```

## Project structure

```
druido/
├── client/          # Next.js frontend
│   ├── app/         # Pages (login, app, decks, search)
│   ├── components/  # UI components (shadcn + custom)
│   ├── hooks/       # useAuth, useFSRS
│   └── lib/         # API client, i18n, utils
├── server/          # NestJS backend
│   ├── src/
│   │   ├── auth/    # JWT auth module
│   │   ├── decks/   # Decks CRUD
│   │   ├── cards/   # Cards + FSRS scheduling
│   │   └── prisma/  # Prisma service
│   └── prisma/      # Schema + migrations
└── docker-compose.yml
```

## License

MIT
