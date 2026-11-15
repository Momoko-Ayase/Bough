# Bough

> *Hang a keepsake on my bough.*

**Bough** is a self-hosted, single-owner winter keepsake tree built for **Cloudflare Workers**. Deploy your own tree in one command (free tier friendly, zero manual database setup), share your link or QR invitation card with friends, and collect handcrafted ornaments paired with open or wax-sealed winter letters.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Momoko-Ayase/Bough)

---

## Highlights

- **Tactile Storybook Craft**:
  - 5-tier botanical Noble Fir illustration with snow-dusted boughs, Bordeaux velvet ribbon swags, spun-brass garlands, twinkling incandescent lights, embroidered linen skirt, and wrapped parcels.
  - **28 bespoke SVG ornaments** across 4 material collections (*Blown Glass*, *Brass & Enamel*, *Wood & Felt*, *Hearth & Paper*) + **6 owner-selectable Crown Toppers**.
  - Subtle pendulum sway physics, optional Web Audio music-box chimes, and cotton-paper / crimson wax-seal letter cards.
- **Zero-CLI-Setup Serverless Persistence**:
  - Powered by a **SQLite-backed Cloudflare Durable Object** (`BoughStore`) — works on the **Cloudflare Workers Free plan** with automatic schema migration on first request (no `d1 create` or manual `database_id` editing needed).
- **Owner Privacy & Visibility Modes**:
  - **Open letters (`public`)**: Visitors can open public ornaments (with an optional per-note *"Seal privately for owner"* toggle for guests).
  - **Sealed for owner (`owner_only`)**: Visitors see every ornament hanging on the tree and who sent it, while letter contents remain wax-sealed exclusively for the tree owner.
  - **Time-capsule (`scheduled`)**: All notes stay wax-sealed until your chosen reveal date & time.
  - **Sender Receipt**: Guests keep a local cryptographic receipt token in `localStorage` so they can re-read the note they wrote without exposing it to other visitors.
- **Cloudflare Turnstile Protection + Rate Limiting**:
  - Every guest submission verifies a single-use Turnstile token via Cloudflare's `siteverify` API alongside per-IP Durable Object rate limiting.
- **5 Languages + Responsive Desktop & Mobile UX**:
  - Built-in i18n for **English (`en`)**, **Simplified Chinese (`zh-CN`)**, **Traditional Chinese (`zh-TW`)**, **Japanese (`ja`)**, and **Korean (`ko`)** with tailored Latin + CJK serif/gothic typography.
- **End-of-Season Keepsake Archive**:
  - Export your entire tree's letters anytime as structured **JSON** or a printable **Markdown Keepsake Book (`.md`)**.

---

## Quick Start (Local Development)

Requirements: **Node.js 20+** and **pnpm** (or npm).

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:5173`:
- On `localhost`, Bough automatically seeds 6 sample ornaments and uses Cloudflare's official Turnstile test keys so you can test hanging ornaments and claiming the tree out of the box.

---

## Deploy Your Own Tree to Cloudflare Workers

Every person who wants a tree deploys their own Worker instance:

```bash
# 1. Authenticate Wrangler with your Cloudflare account (first time only)
npx wrangler login

# 2. Build and deploy
pnpm run deploy
```

That's it — SQLite storage inside the `BoughStore` Durable Object initializes automatically on first visit.

### Configuring Owner Password & Turnstile in Production

You have **two ways** to configure your deployed tree:

#### Option A: Zero-CLI Web Setup (Easiest)
1. Open your deployed `https://<your-bough>.workers.dev` URL immediately after deploying.
2. Click **Claim tree** in the top-right corner to set your owner password, name, and tree headline.
3. In **Tree Studio**, paste your **Cloudflare Turnstile Site Key & Secret Key** (create a free widget at **Cloudflare Dashboard → Turnstile** scoped to your Worker domain) and choose your letter visibility mode (`Open letters`, `Sealed for owner`, or `Time-capsule`).

#### Option B: Lock via Cloudflare Environment Secrets
If you prefer immutable infrastructure secrets, set them via Wrangler CLI (they automatically override First-Boot claim and lock the Turnstile fields in the UI):

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put TURNSTILE_SITE_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```

---

## Tech Stack

- **Runtime & Hosting**: Cloudflare Workers + Static Assets (`@cloudflare/vite-plugin`, Wrangler v4)
- **API & Storage**: Hono + SQLite-backed `DurableObject` (`BoughStore`), Web Crypto (`PBKDF2-SHA256` + `HMAC-SHA256` `HttpOnly` sessions)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), `@marsidev/react-turnstile`, `qrcode`

---

## Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Start Vite + local Cloudflare `workerd` runtime |
| `pnpm run build` | Typecheck (`tsc -b`) and build client + Worker bundle |
| `pnpm run preview` | Build and preview production bundle locally |
| `pnpm run deploy` | Build and deploy to Cloudflare Workers |
| `pnpm run test` | Run unit & security verification tests |
| `pnpm run cf-typegen` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc` |

---

## License

[MIT](./LICENSE) © Momoko Ayase

