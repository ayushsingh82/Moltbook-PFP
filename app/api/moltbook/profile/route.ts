import { NextRequest, NextResponse } from "next/server";

const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing name parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${MOLTBOOK_API}/agents/profile?name=${encodeURIComponent(name)}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data?.error || "Profile not found" },
        { status: res.status }
      );
    }

    const agent = data?.agent;
    if (!agent) {
      return NextResponse.json(
        { success: false, error: "Invalid profile response" },
        { status: 502 }
      );
    }

    const followers =
      typeof agent.followers === "number"
        ? agent.followers
        : typeof agent.follower_count === "number"
          ? agent.follower_count
          : undefined;
    const following =
      typeof agent.following === "number"
        ? agent.following
        : typeof agent.following_count === "number"
          ? agent.following_count
          : undefined;
    const stats = agent.stats && typeof agent.stats === "object" ? agent.stats : {};
    const posts = typeof stats.posts === "number" ? stats.posts : undefined;
    const comments = typeof stats.comments === "number" ? stats.comments : undefined;

    return NextResponse.json({
      success: true,
      profile: {
        profileId: agent.id || `mb_${agent.name}`,
        profileType: "agent" as const,
        username: agent.name,
        description: agent.description,
        karma: agent.karma,
        isClaimed: agent.is_claimed,
        avatarUrl: agent.avatar_url,
        owner: agent.owner,
        followers,
        following,
        posts,
        comments,
      },
    });
  } catch (err) {
    console.error("[moltbook profile fetch]", err);
    return NextResponse.json(
      { success: false, error: "Could not fetch profile" },
      { status: 502 }
    );
  }
}
