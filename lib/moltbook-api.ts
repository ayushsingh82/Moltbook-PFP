/**
 * Fetch Moltbook profile info (followers and other fields) by profile URL or username.
 * Uses https://www.moltbook.com/api/v1 — call from server (API routes, Server Components)
 * or via your Next.js API route from the client to avoid CORS.
 */

const MOLTBOOK_API_BASE = "https://www.moltbook.com/api/v1";

/** Extract username from a Moltbook profile URL (e.g. https://www.moltbook.com/u/ayushcursor → ayushcursor). */
export function parseProfileUrl(profileUrl: string): string | null {
  const trimmed = profileUrl.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/moltbook\.com\/u\/([^/\s?#]+)/i);
  if (match) return match[1];
  return trimmed;
}

/** Profile + followers and related info returned by Moltbook API (agent profile). */
export interface MoltbookProfileInfo {
  profileId: string;
  username: string;
  name?: string;
  description?: string;
  karma?: number;
  isClaimed?: boolean;
  avatarUrl?: string;
  owner?: string;
  /** Follower count when provided by the API (e.g. followers, follower_count). */
  followers?: number;
  /** Raw agent object for any extra fields the API returns. */
  raw?: Record<string, unknown>;
}

/** Options for fetch. */
export interface MoltbookFetchOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Fetch agent profile (and followers if the API returns them) by username.
 * Use from server-side code or from a Next.js API route.
 */
export async function fetchMoltbookProfileByUsername(
  username: string,
  options: MoltbookFetchOptions = {}
): Promise<MoltbookProfileInfo | null> {
  const { signal, timeoutMs = 10000 } = options;
  const url = `${MOLTBOOK_API_BASE}/agents/profile?name=${encodeURIComponent(username)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: signal ?? (timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) return null;

  const agent = data?.agent;
  if (!agent || typeof agent !== "object") return null;

  const followers =
    typeof agent.followers === "number"
      ? agent.followers
      : typeof agent.follower_count === "number"
        ? agent.follower_count
        : typeof agent.followers_count === "number"
          ? agent.followers_count
          : undefined;

  return {
    profileId: agent.id ?? `mb_${agent.name}`,
    username: agent.name ?? username,
    name: agent.name,
    description: agent.description,
    karma: agent.karma,
    isClaimed: agent.is_claimed,
    avatarUrl: agent.avatar_url,
    owner: agent.owner,
    followers,
    raw: agent as Record<string, unknown>,
  };
}

/**
 * Fetch Moltbook profile info by profile URL (e.g. https://www.moltbook.com/u/ayushcursor).
 * Parses username from the URL then fetches profile.
 */
export async function fetchMoltbookProfileByUrl(
  profileUrl: string,
  options: MoltbookFetchOptions = {}
): Promise<MoltbookProfileInfo | null> {
  const username = parseProfileUrl(profileUrl);
  if (!username) return null;
  return fetchMoltbookProfileByUsername(username, options);
}
