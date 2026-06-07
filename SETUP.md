# Events CMS — setup

The Public Events feed is editable through a small built-in CMS at **`/admin`**,
backed by Postgres (Neon). Until `DATABASE_URL` is set, the public site falls
back to the static seed in `lib/events.ts`, so nothing breaks before setup.

Stack: Next.js (server app on Vercel) · Neon Postgres · Drizzle ORM ·
Auth.js (single shared admin) · Vercel Blob (images).

---

## 1. Provision Neon

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the **pooled** connection string.
3. Put it in `.env.local` as `DATABASE_URL` (copy from `.env.example`).

## 2. Create the tables

```bash
npm install
npm run db:push      # creates events / waitlist_signups / contact_messages
npm run db:seed      # loads the 4 starter events from lib/events.ts (idempotent)
```

(For versioned migrations instead of `db:push`, use `npm run db:generate` then
`npm run db:migrate`.)

## 3. Admin login (stored in the database)

The admin account lives in the `users` table (not env). Add the session secret
to `.env.local`, then create the admin:

```
AUTH_SECRET="<npx auth secret>"
```

```bash
# creates / resets the admin (idempotent — also your password-reset + lockout recovery)
npm run admin:create -- "web@ctrfoodworks.com" "your-strong-password"
```

Editors can change their own password later at **/admin/account**.

## 4. Image uploads (Vercel Blob)

1. Vercel dashboard → **Storage → Blob → Create**, connect it to the project.
2. Locally: `vercel env pull .env.local` (or copy `BLOB_READ_WRITE_TOKEN` in by hand).

## 5. Run it

```bash
npm run dev
```

- Public events: <http://localhost:3000/events>
- Admin CMS: <http://localhost:3000/admin> (redirects to `/admin/login`)

Editing in `/admin` writes to Neon and revalidates `/events`, so changes appear
within seconds — no redeploy.

---

## Deploying to Vercel

1. Import the repo in Vercel (framework auto-detected as Next.js).
2. Add the env vars under **Settings → Environment Variables** (Production +
   Preview): `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN`.
3. Deploy. After the first deploy, run the table setup + create the admin once
   against the prod DB (locally, with the prod `DATABASE_URL`):
   `npm run db:migrate && npm run admin:create -- "web@ctrfoodworks.com" "password"`.

## Where submissions go

The waitlist and contact forms (previously Netlify Forms) now POST to
`/api/waitlist` and `/api/contact` and store rows in Neon
(`waitlist_signups`, `contact_messages`). View them via `npm run db:studio`.
A future enhancement could surface these inside `/admin` and/or email a ping on
new submissions (e.g. with Resend).
