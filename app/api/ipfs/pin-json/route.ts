import { NextRequest, NextResponse } from "next/server";

const PINATA_UPLOADS_URL = "https://uploads.pinata.cloud/v3/files";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    console.error("[ipfs pin-json] Missing PINATA_JWT in .env");
    return NextResponse.json({ error: "Metadata upload failed" }, { status: 503 });
  }

  try {
    const pinataContent = await request.json();
    const jsonString = JSON.stringify(pinataContent);
    const blob = new Blob([jsonString], { type: "application/json" });
    const file = new File([blob], "metadata.json", { type: "application/json" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("network", "public");

    const res = await fetch(PINATA_UPLOADS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = data?.error ?? data?.message ?? JSON.stringify(data);
      console.error("[ipfs pin-json] Pinata error — status:", res.status, "body:", JSON.stringify(data), "detail:", detail);
      return NextResponse.json({ error: "Metadata upload failed" }, { status: 502 });
    }

    const cid = data.data?.cid ?? data.IpfsHash;
    if (!cid) {
      console.error("[ipfs pin-json] No CID in response:", data);
      return NextResponse.json({ error: "Metadata upload failed" }, { status: 502 });
    }

    return NextResponse.json({ cid, uri: `ipfs://${cid}` });
  } catch (err) {
    console.error("[ipfs pin-json] Exception:", err);
    return NextResponse.json({ error: "Metadata upload failed" }, { status: 500 });
  }
}
