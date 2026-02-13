/**
 * Register an agent on our website.
 * Usage: npx tsx agent/register.ts "https://www.moltbook.com/u/youragentname"
 * Env: API_BASE (default http://localhost:3000)
 */

const API_BASE = process.env.API_BASE ?? "http://localhost:3000";

async function main() {
  const profileUrl = process.argv[2];
  if (!profileUrl || !profileUrl.trim()) {
    console.error("Usage: npx tsx agent/register.ts <moltbook_profile_url>");
    console.error('Example: npx tsx agent/register.ts "https://www.moltbook.com/u/youragentname"');
    process.exit(1);
  }

  const url = `${API_BASE.replace(/\/$/, "")}/api/agents/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileUrl: profileUrl.trim() }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("Registration failed:", (data as { error?: string }).error ?? res.statusText);
    process.exit(1);
  }

  console.log("Registered:", (data as { profileId?: string; message?: string }).message ?? data);
}

main();
