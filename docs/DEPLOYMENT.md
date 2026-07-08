# Deployment Guide

## Requirements

Before deploying, ensure you have:

- Node.js 18+
- Vercel account
- (Optional) Supabase project

---

# Local Development

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Start the development server:

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Production Build

Verify the production build locally:

```bash
npm run build
npm start
```

---

# Deploy to Vercel

Install the Vercel CLI:

```bash
npm install -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
vercel --prod
```

The application is fully compatible with **Vercel** and requires no additional configuration.

---

# Environment Variables

Configure the following variables in the Vercel Dashboard.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public API Key |

> If these variables are not provided, the application automatically falls back to local seed data. Transit caching will be disabled, but all core features continue to work.

---

# Deployment Flow

```
Push Code
     │
     ▼
GitHub
     │
     ▼
Vercel Build
     │
     ▼
Next.js Application
     │
     ▼
Live Deployment
```

---

# Deployment Features

- Zero-configuration Vercel deployment
- Automatic production builds
- Environment variable support
- Supabase integration
- Static data fallback
- Optimized Next.js production build

---

# Future Improvements

The project can easily be extended with:

- GitHub Actions CI/CD
- Docker deployment
- Custom domain
- Monitoring & Analytics
- Automatic cache invalidation

---

# Summary

GeoSmart is deployment-ready with minimal setup.

Simply configure the environment variables, deploy to Vercel, and the application is ready for production.
