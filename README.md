# TextGuard 3.0 — IDB Risk & Compliance Analyzer

AI-powered risk and compliance flagging for IDB project documents using Claude.

## Project Structure

```
textguard/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js      ← Serverless API proxy (keeps key safe)
│   ├── layout.js
│   ├── page.js
│   └── TextGuard.js          ← Main app component
├── .env.local                 ← Your API key (never commit this!)
├── .gitignore
├── next.config.js
└── package.json
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. Run locally:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
When prompted, add environment variable: `ANTHROPIC_API_KEY`

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com → New Project → Import your repo
3. In project settings → Environment Variables → Add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-key-here`
4. Click Deploy

That's it! Vercel auto-deploys on every git push.
