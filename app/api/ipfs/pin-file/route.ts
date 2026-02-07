import { NextRequest, NextResponse } from "next/server";

const PINATA_UPLOADS_URL = "https://uploads.pinata.cloud/v3/files";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    console.error("[ipfs pin-file] Missing PINATA_JWT in .env");
    return NextResponse.json({ error: "Image upload failed" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Missing file in form (field: file)" }, { status: 400 });
    }

    // Read file into buffer so Node sends a proper body to Pinata (avoids stream/FormData issues)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const name = file.name || "pfp.png";
    const type = file.type || "image/png";

    const pinataForm = new FormData();
    pinataForm.append("file", new File([buffer], name, { type }), name);
    pinataForm.append("network", "public");

    const res = await fetch(PINATA_UPLOADS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: pinataForm,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const raw = data?.error ?? data?.message ?? data?.errors?.[0];
      const detail = typeof raw === "string" ? raw : raw && typeof raw === "object" && "message" in raw ? String((raw as { message: unknown }).message) : JSON.stringify(data);
      console.error("[ipfs pin-file] Pinata error — status:", res.status, "body:", JSON.stringify(data), "detail:", detail);
      return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
    }

    const cid = data.data?.cid ?? data.IpfsHash;
    if (!cid) {
      console.error("[ipfs pin-file] No CID in response:", data);
      return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
    }

    return NextResponse.json({ cid, uri: `ipfs://${cid}` });
  } catch (err) {
    console.error("[ipfs pin-file] Exception:", err);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
