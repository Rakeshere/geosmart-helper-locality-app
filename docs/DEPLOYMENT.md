# Deployment Guide — GeoSmart Helper Locality App

## Vercel Deployment (Recommended)

### Prerequisites
- Node.js 18+
- Vercel account (free)
- Supabase project (optional)

### Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy from project root
cd geosmart-app
vercel --prod
```

### Environment Variables (Vercel Dashboard)

Go to: **Project Settings → Environment Variables**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

> Without these, the app works with static data. Transit caching is disabled.

---

## Local Development

```bash
npm install
cp .env.local.example .env.local  # Fill in Supabase keys
npm run dev                        # http://localhost:3000
```

## Production Build (local test)

```bash
npm run build   # TypeScript check + production bundle
npm start       # Serve production build
```

---

## vercel.json (optional tuning)

```json
{
  "functions": {
    "app/api/transit/route.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

> `maxDuration: 30` extends the serverless function timeout for Overpass API (default 10s on Hobby).

---

## Self-hosted (Docker)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Add to `next.config.js`:
```javascript
const nextConfig = {
  output: 'standalone',  // Add this for Docker
  // ...
};
```

---

## CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run type-check
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```
