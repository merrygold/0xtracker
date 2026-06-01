# 0xTracker — MicroTool Builder Tracker

Track every stage of building microtool websites — from idea to monetization.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **9-Stage Pipeline**: Idea → Research → Domain → Setup → Build → SEO → Deploy → Monetize → Monitor
- **Task Management**: Track tasks for each stage with status (To Do, In Progress, Done, Blocked)
- **Financial Tracking**: Log costs (domain, hosting, APIs) and revenue (AdSense), see ROI per project
- **Stats & Analytics**: Visualize revenue vs costs, task completion by stage
- **Reference Guide**: Complete checklist, dos & don'ts, and ready-to-use prompts for every stage
- **SEO Prompt Generator**: Auto-generate SEO prompts using your keywords
- **AI Build Prompt**: Auto-generate coding prompts with competitor URLs
- **Mobile First**: Fully responsive — use it while traveling

## Pipeline Stages

Each project goes through 9 stages:

1. **Idea** — Find a problem, analyze competition
2. **Research** — Validate keywords, find supporting keywords & FAQs
3. **Domain** — Search for .com domains, plan purchase
4. **Setup** — Install tools, set up Astro JS + AI agents
5. **Build** — Code with AI, iterate, add features
6. **SEO** — Write content, structured data, meta tags
7. **Deploy** — Host on Cloudflare, submit to search consoles
8. **Monetize** — Apply for AdSense, add ads
9. **Monitor** — Track rankings, traffic, revenue

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** + shadcn/ui
- **Zustand** (state management with localStorage persistence)
- **Recharts** (charts)
- **Supabase** (future: auth + database)

## Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

## Deployment

Deploy to Vercel:

```bash
vercel
```