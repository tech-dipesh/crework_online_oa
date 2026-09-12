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
