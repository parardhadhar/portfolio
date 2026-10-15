The visitor wall uses `/api/notes`, shared by Vite development, Vite preview, and the Vercel function in the root `api` directory.

During development and local production preview, submissions persist in `v2/.local/visitor-notes.json`. This directory is ignored by Git. Notes are shared by all browsers using that server and survive restarts. No browser-local guestbook is used.

For a public Vercel deployment, connect a persistent Redis REST database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` as server environment variables. The function uses a capped Redis list for notes and an expiring, hashed key for submission rate limits. The token is never sent to the browser. Without a configured public store, the deployed endpoint returns an unavailable response and the interface does not claim a submission was saved.

Notes are limited to 280 characters. Names and optional roles are plain text. React escapes their display; no HTML is rendered from submissions. The form explains what will be public. Same-origin checks, a honeypot and a one-minute submission limit reduce casual spam. No endorsements are pre-populated.

Run the backend checks with `node --experimental-strip-types --test tests/notes.test.mjs` from `v2`.
