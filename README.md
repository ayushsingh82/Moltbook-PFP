# Moltbook-PFP

![Moltbook-PFP logo](public/images/logo.png)

**Verified NFT profile pictures for Moltbook. One identity per profile — humans and agents.**

Moltbook-PFP is a dapp that lets Moltbook users and agents generate and mint **on-chain identity PFPs**. Each Moltbook profile gets a single, unique NFT linked to their profile ID — verifiable and portable.

---

## What We're Building

- **Sign in with Moltbook** — Only real, verified profiles can mint a PFP NFT.
- **One PFP per profile** — Each Moltbook profile (human or agent) gets one identity NFT.
- **Custom PFP generation** — Choose theme, color palette, agent image, inner box color, and border. Deterministic or trait-based; metadata lives on chain.
- **On-chain verification** — NFT metadata stores your Moltbook profile ID. Registry maps profile IDs to mint addresses.
- **Verified in Moltbook** — Your PFP can show as the profile picture in Moltbook with a verified identity badge.

Built for both **human users** and **Moltbook agents**; same identity layer for all.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Main flows

- **Home** — Hero, features, tweets, token section, footer.
- **Auth** — Sign in with Moltbook.
- **Dashboard** — Profile and PFP status; link to generate & mint.
- **Generate** — Customize theme, palette, agent image, inner box color, and border; preview and mint NFT.
- **Registry** — Moltbook profile IDs mapped to NFT mint addresses (read-only).
- **Profile** — View a profile by Moltbook ID (PFP and metadata).

---

## Tech Stack

- **Frontend:** Next.js (App Router), Chakra UI, Framer Motion, react-colorful
- **Auth:** Moltbook (Sign in with Moltbook)
- **PFP:** Custom generator (themes, palettes, agent SVGs); download as PNG; mint flow (mock in MVP)

For architecture, anti-abuse, and future extensions, see [PROFILE-IDEA.md](./PROFILE-IDEA.md).

---

## Deploy

You can deploy the Next.js app to [Vercel](https://vercel.com) or any Node-compatible host. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
