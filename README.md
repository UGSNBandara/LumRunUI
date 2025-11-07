# LumRun Scoreboard UI

Simple Next.js (App Router) leaderboard for the LumRun game. It connects directly to MongoDB Atlas to list users and add new players (initial score 0).

## Features
- List top users sorted by `highScore` (limit 100)
- Add a new username (unique, validated) starting at score 0
- Minimal styling (CSS) ready for quick customization
- Serverless-friendly MongoDB connection caching

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- MongoDB Atlas (official driver)

## Environment Variables
Create `.env.local` (never commit) based on `.env.local.example`:

```
MONGO_URL="mongodb+srv://<user>:<password>@lumrun.kqbrce1.mongodb.net/?appName=LumRun"
DB_NAME="game"
COLL_NAME="users"
# Optional if needed for absolute fetches
# NEXT_PUBLIC_BASE_URL="https://your-vercel-domain.vercel.app"
```

On Vercel, add these in Project Settings > Environment Variables (Production & Preview).

## Local Development

Install dependencies then run dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel)
1. Push repo to GitHub.
2. Import project in Vercel dashboard.
3. Set Environment Variables (`MONGO_URL`, `DB_NAME`, `COLL_NAME`).
4. Deploy. (If scoreboard shows empty list ensure your MongoDB collection has documents or add users via form.)

## API Endpoints
`GET /api/users` -> `{ users: User[] }` sorted by `highScore DESC`.

`POST /api/users` body: `{ "username": "playerName" }`
Responses:
- 201 Created: returns document
- 409 Conflict: username exists
- 400 Bad Request: validation error

## User Document Shape
```
{
  _id: string,
  username: string,
  highScore: number,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

## Updating Scores (Future)
Currently only creation + listing. To update scores, add a `PATCH /api/users/[id]` or action to submit new score with server verification.

## Notes
- Direct DB access from API routes; no ORM used.
- Add an index for production performance:
  - In MongoDB Atlas create: `{ username: 1 }` unique
  - Optionally: `{ highScore: -1 }` for faster leaderboard sorts

## License
MIT
