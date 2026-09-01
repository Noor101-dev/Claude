# My Coding Assistant — Vercel Deployment

Same coding assistant app (chat + code blocks with Copy buttons), restructured
to run on Vercel's serverless functions instead of a long-running server.

## Folder structure
```
├── api/
│   └── chat.js       ← serverless function (replaces server.js)
├── public/
│   └── index.html    ← frontend
├── package.json
└── vercel.json        ← tells Vercel how to route requests
```

## Deploy from mobile (GitHub + Vercel)

1. Create a GitHub repo and upload all 4 files above, keeping the
   `api/` and `public/` folder structure exactly as shown.

2. Go to vercel.com → sign in (GitHub login is easiest) → **Add New →
   Project** → import that repo.

3. Before deploying, add an environment variable:
   - Name: `BYNARA_API_KEY`
   - Value: your key from router.bynara.id (starts with `sk-nry-`)

4. Tap **Deploy**. Vercel builds it and gives you a public URL —
   open it on your phone.

## If you add the env var after deploying

Go to your Project → Settings → Environment Variables → add
`BYNARA_API_KEY` → then go to Deployments → tap the latest one → 
Redeploy (so it picks up the new variable).

## Notes

- The key is only read inside `api/chat.js` from `process.env` — never
  put it in `index.html`, and never commit it to GitHub.
- NaraRouter is an unofficial third-party gateway, not an Anthropic
  product — treat its free tier as unstable, not something to rely on
  for anything important.
