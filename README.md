# Lead Intelligence POC

AI-powered company discovery and intent scoring platform. Discovers 6200+ YCombinator companies and scores their likelihood to purchase outbound/sales services using Grok AI.
## Overview
This is the POC system that discovers companis using the ycombinator api with intent singals with score companies using AI.

## Quick Start

### Prerequisites
### Setup

```bash
pnpm install
cp .env.local.example .env.local
pn generate
pnpm migrate
pn seed
pnpm dev
```

Visit `http://localhost:3000`

## Architecture

### Data Pipeline

```
YCombinator API (6200+ funded startups)
├── Extract: name, website, industry, stage, team_size
├── Detect signals: recently_funded, hiring_sales
└── Store in PostgreSQL
        ↓
Grok AI Scoring Engine
├── Rule-based: funding + hiring + growth
├── AI refinement: Grok handles edge cases
└── Confidence metrics per company
        ↓
React Dashboard
├── Filter by score, industry
├── Sort by score, date, name
└── Detail page with reasoning
```

### Key Components

#### Data Sources
- **YCombinator API**: 6200+ funded companies (primary)
- **Seed CSV**: 36 companies (fallback)

#### Scoring Engine
Hybrid approach combining:
- Rule-based initial scoring (0-100)
- Grok AI for nuanced judgment
- Confidence metrics per company

#### Frontend
- **Dashboard**: Overview with stats and filtering
- **Company Card**: Individual preview with signals
- **Detail Page**: Full info with scoring reasoning

### Database Schema

```prisma
Company
├── id (String, primary key)
├── name (String, unique)
├── website (String?)
├── industry (String?)
├── stage (String?)
├── signals (String[])
├── intentScore (Int, 0-100)
├── scoringReasoning (String?)
├── confidence (Float?)
└── timestamps
```

## API Endpoints

### GET `/api/companies`

Query parameters:
- `sortBy`: "intentScore" | "detectedAt" | "name" (default: intentScore)
- `minScore`: Number 0-100 (default: 0)
- `industry`: String filter (case-insensitive)

Response:
```json
[
  {
    "id": "cuid...",
    "name": "Acme AI",
    "website": "acme-ai.com",
    "industry": "SaaS",
    "stage": "Series A",
    "intentScore": 85,
    "signals": ["recently_funded", "hiring_sales"],
    "scoringReasoning": "...",
    "confidence": 0.92
  }
]
```

### GET `/api/companies/[id]`
Fetch single company details.

### POST `/api/ingest`
Trigger data ingestion pipeline from YCombinator.

Response:
```json
{
  "success": true,
  "totalCompanies": 6200,
  "successCount": 6198,
  "failureCount": 2
}
```

## Scoring Logic

### Intent Scoring (0-100)

```
80-100: High Intent
- Multiple growth signals
- Recent funding + actively hiring
- Expansion signals

60-79: Medium-High Intent
- Either recent funding OR hiring SDRs
- Clear growth trajectory

40-59: Medium Intent
- Some growth signals
- Unclear fit for services

20-39: Low-Medium Intent
- Weak signals
- Early stage with limited traction

0-19: Low Intent
- No relevant signals
- Not a fit
```

### Scoring Factors

Each company is evaluated for:
- **Funding**: YCombinator backed (automatic signal)
- **Hiring**: `isHiring` boolean from YC API
- **Stage**: Pre-seed → Growth
- **Industry**: Fintech, SaaS, etc.

## UI Design

### Color Scheme
- **Primary**: Emerald/Teal (high intent, growth)
- **Secondary**: Amber/Orange (medium intent, caution)
- **Neutral**: Slate (background, text)
- **Background**: Dark slate with subtle grid pattern

### Components
- **ScoreBadge**: Circular progress indicator with confidence
- **CompanyCard**: Gradient card with glass-morphism on hover
- **LeadsDashboard**: Responsive grid with stats and filters

## V1 vs V2 Roadmap

### V1 (Current)
- ✓ 6200+ YCombinator companies
- ✓ Grok-powered hybrid scoring
- ✓ Company enrichment (industry, stage, insights)
- ✓ Dashboard with filtering and sorting
- ✓ PostgreSQL persistence
- ✓ Deployed on Vercel

### V2 (Future)
- [ ] Real-time signal tracking (background jobs)
- [ ] LinkedIn scraping for hiring signals
- [ ] Contact extraction (Hunter API)
- [ ] Custom ICP definition
- [ ] Workflow automation (export to CRM)
- [ ] Historical scoring analytics
- [ ] Multi-user workspaces


# Environment variables needed:
- `DATABASE_URL` (PostgreSQL connection)
- `GROK_API_KEY` (X/xAI API key)

## Technical Decisions
### Why YCombinator API?
- 6200+ verified funded startups
- No authentication needed
- Reliable, updates daily
- `isHiring` boolean included
- 100% free

### Why Grok?
- Lower cost than Claude
- Fast inference
- Suitable for scoring tasks
- Free tier available

### Why PostgreSQL?
- Relational structure fits company data
- Prisma ORM for type safety
- Scalable for production
- Indexed for performance

### Why Next.js Full-Stack?
- Single codebase deployment
- API routes + frontend together
- Vercel one-click deployment
- No separate backend needed

## Performance Notes
- Dashboard loads 100 companies per request
- Scoring is sequential (can be parallelized in V2)
- Database indexes on: intentScore, detectedAt, signalSource
- Initial ingest of 6200 companies: ~30-60 minutes (rate-limited by Grok)

## Folder Structure:
```
lead-crework/
├── app/
│   ├── api/
│   │   ├── companies/
│   │   ├── ingest/
│   ├── company/[id]/
│   ├── components/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── prisma.ts
│   ├── grok.ts
│   ├── ingest.ts
│   └── data-sources/
│       ├── ycombinator.ts
│       └── seed.ts
├── prisma/
│   └── schema.prisma
├── data/
│   └── seed_companies.csv
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── .env.local.example
```
# Thanks.