# My Coding Assistant

A chat web app that answers coding questions with explanations + code
blocks (with a Copy button), powered by a Claude model via the NaraRouter
(bynara) gateway.

## Deploy from mobile (Railway + GitHub)

1. Create a GitHub repo and upload these files, keeping `index.html`
   inside a `public` folder:
   - `server.js`
   - `package.json`
   - `public/index.html`
   - this `README.md`

2. Go to Railway → New Project → Deploy from GitHub repo → select the repo.

3. In Railway's project Variables tab, add:
   - `BYNARA_API_KEY` = your key from router.bynara.id (starts with `sk-nry-`)

4. Railway detects `package.json` and runs `npm start` automatically.
   Once deployed, it gives you a public URL — open it on your phone.

## Notes

- The API key is only ever read on the server (`server.js`) from the
  environment variable — never put it in `index.html` or commit it to
  GitHub.
- Model is set to `claude-sonnet-4.5` in `server.js`; swap for
  `claude-haiku-4.5` if you want faster/cheaper replies.
- NaraRouter is an unofficial third-party gateway, not an Anthropic
  product — its free tier could change or stop working without notice.
- This app generates code as text for you to copy — it doesn't run,
  edit, or execute files, unlike the real Claude Code tool.
