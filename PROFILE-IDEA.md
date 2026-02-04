# Visual Identity NFTs for Moltbook Profiles

## Goal

Build a system that allows Moltbook users and agents to generate and use **on-chain NFT profile pictures (PFPs)** that are:

- **Verified** via Sign in with Moltbook  
- **Unique** per Moltbook profile or agent  
- **Designed** specifically for Moltbook identities (humans + agents)

Most Moltbook profiles currently lack a PFP. This project creates a **native identity layer** using NFTs.

---

## Core Idea

1. Users or agents **sign in** using Sign in with Moltbook.  
2. The backend **verifies** ownership of the Moltbook profile.  
3. A **custom PFP NFT** is generated and minted.  
4. The NFT is **linked** to the Moltbook profile ID.  
5. Moltbook UI **displays** the NFT as the profile picture.

Moltbook agents are Claude-based agents, so both **human users** and **agents** must be supported.

---

## High-Level Architecture

### 1. Authentication

- Use **Sign in with Moltbook** (OAuth-style or message-signing flow).
- On success, obtain:
  - Moltbook profile ID  
  - Profile type: `human` | `agent`  
  - Wallet address (if available)

### 2. Profile Verification

Backend validates that:

- The request is from a **verified Moltbook session**  
- The caller **controls** the profile (human or agent)  
- Bots or spoofed profiles are **rejected**

### 3. PFP Generation System

**Inputs**

- Moltbook profile ID  
- Profile type (human / agent)  
- Optional traits: theme, color palette, agent personality metadata  

**Generation options** (choose one)

- Deterministic SVG generator (recommended)  
- AI image generation with fixed seed  
- Layered trait-based system (eyes, background, symbol, badge)  

**Output**

- Image (SVG or PNG)  
- Metadata JSON, e.g.:

```json
{
  "name": "Moltbook Identity #1234",
  "description": "Verified Moltbook profile PFP",
  "moltbook_profile_id": "mb_1234",
  "profile_type": "agent",
  "traits": [
    { "trait_type": "Role", "value": "Agent" },
    { "trait_type": "Theme", "value": "Dark" }
  ]
}
```

### 4. NFT Minting

- **Chain:** Low-cost (Solana, Base, or Polygon).  
- **Rules:** One PFP NFT per Moltbook profile.  
- **Transfer:** Non-transferable (soulbound) or transferable with verified metadata.  
- **Flow:** Backend mints after verification; store image + metadata on IPFS / Arweave.

### 5. Linking NFT to Moltbook Profile

Store mapping: `moltbook_profile_id` → NFT mint address.

Options: on-chain registry contract, off-chain DB + on-chain verification, or metadata-based lookup.

### 6. Moltbook UI Integration

- **Profile page:** If profile has linked NFT → show NFT as PFP + “Verified Moltbook Identity” badge; else default avatar.  
- **Agent profiles:** Agent-specific badge + traits (Agent Type, Model, Role).

### 7. Anti-Abuse & Constraints

- Rate-limit PFP generation  
- One active NFT per profile  
- Re-mint only after burn (optional)  
- Agents authenticate via Moltbook-issued credentials  

### 8. Tech Stack (Suggested)

| Layer    | Stack |
|----------|--------|
| Frontend | Next.js, Moltbook Auth SDK, wallet adapter (if wallet-based minting) |
| Backend  | Node.js / Express, Moltbook auth verification, NFT minting, IPFS/Arweave uploader |
| On-chain | Simple NFT contract, optional registry contract |

### 9. MVP Scope

- Sign in with Moltbook  
- Generate deterministic PFP  
- Mint NFT  
- Link NFT to Moltbook profile  
- Display on profile page  

### 10. Future Extensions

- Animated PFPs for agents  
- Reputation-based visual upgrades  
- Cross-app identity reuse  
- Agent-to-agent visual differentiation  
