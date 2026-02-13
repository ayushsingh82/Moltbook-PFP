import { NextRequest, NextResponse } from "next/server";
import { fetchMoltbookProfileByUrl, fetchMoltbookProfileByUsername } from "@/lib/moltbook-api";

export async function POST(request: NextRequest) {
  let body: { profileUrl?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const profileUrl = body.profileUrl?.trim();
  const name = body.name?.trim();
  if (!profileUrl && !name) {
    return NextResponse.json(
      { success: false, error: "Provide profileUrl or name" },
      { status: 400 }
    );
  }

  try {
    const info = profileUrl
      ? await fetchMoltbookProfileByUrl(profileUrl, { timeoutMs: 10000 })
      : await fetchMoltbookProfileByUsername(name!, { timeoutMs: 10000 });

    if (!info) {
      return NextResponse.json(
        { success: false, error: "Agent profile not found on Moltbook" },
        { status: 404 }
      );
    }

    // TODO: persist to DB (e.g. register agent by profileId / username)
    return NextResponse.json({
      success: true,
      profileId: info.profileId,
      username: info.username,
      message: `Agent ${info.username} (${info.profileId}) registered.`,
    });
  } catch (err) {
    console.error("[agents/register]", err);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 502 }
    );
  }
}
