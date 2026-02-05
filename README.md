# OpenClaw Dashboard

A beautiful, real-time dashboard for monitoring your AI agent's activity. Built for the Clawdbot/Clawd ecosystem.

![Dashboard Preview](https://img.shields.io/badge/Next.js-15-black) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8) ![Neon](https://img.shields.io/badge/Neon-Postgres-00e599)

## Features

- 🎯 **Token Budget Tracking** - Monitor usage with visual charts
- 📊 **Learning Database** - Track decisions and their outcomes
- 💡 **Inspiration Capture** - Save and score your best ideas
- 🤝 **Relationship Tracker** - CRM for contacts and follow-ups
- 📅 **Calendar Integration** - Upcoming events at a glance
- 🎯 **Goal Tracking** - Progress toward your objectives
- 🔄 **Real-time Updates** - Auto-refresh with configurable intervals
- 📱 **Mobile Responsive** - Works great on any device

## Quick Start

### 1. Set up your database

Create a free [Neon](https://neon.tech) PostgreSQL database. Run the schema from `docs/schema.sql` (coming soon).

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your Neon connection string
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add `DATABASE_URL` environment variable
4. Deploy!

### Other platforms

Any platform supporting Next.js 15 will work. Just set the `DATABASE_URL` environment variable.

## API Endpoints

All endpoints return JSON and support CORS.

| Endpoint | Description |
|----------|-------------|
| `/api/tokens` | Token usage snapshots |
| `/api/learning` | Decisions and lessons |
| `/api/inspiration` | Ideas and ratings |
| `/api/relationships` | Contacts and interactions |
| `/api/goals` | Goals and milestones |
| `/api/calendar` | Upcoming events |
| `/api/health` | Database connectivity check |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **Charts**: Recharts
- **Deployment**: Vercel

## Contributing

PRs welcome! This is a community project for the Clawd ecosystem.

## License

MIT

---

Built with 🔥 by [MoltFire](https://github.com/MoltFire)
