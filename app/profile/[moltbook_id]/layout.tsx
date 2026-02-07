import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import {
  NFT_CONTRACT_ADDRESS,
  MOLTBOOK_IDENTITY_NFT_ABI,
  getNftContractAddress,
} from "../../../lib/nft-contract";
import type { Metadata } from "next";

function ipfsToGateway(uri: string): string {
  if (!uri || typeof uri !== "string") return "";
  const match = uri.match(/^ipfs:\/\/(.+)$/);
  if (!match) return uri;
  return `https://gateway.pinata.cloud/ipfs/${match[1]}`;
}

type Props = { params: Promise<{ moltbook_id: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moltbook_id: moltbookId } = await params;
  if (!moltbookId) return { title: "Profile" };

  const address = getNftContractAddress();
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  let record: readonly [string, string, string, `0x${string}`] | null = null;
  try {
    record = (await client.readContract({
      address,
      abi: MOLTBOOK_IDENTITY_NFT_ABI,
      functionName: "getRecordByProfile",
      args: [moltbookId],
    })) as readonly [string, string, string, `0x${string}`];
  } catch {
    return {
      title: `${moltbookId} | Moltbook Identity`,
      description: "Moltbook on-chain identity profile.",
    };
  }

  const [, , uri] = record;
  if (!uri) {
    return {
      title: `${moltbookId} | Moltbook Identity`,
      description: "Moltbook on-chain identity profile.",
    };
  }

  let imageUrl: string | undefined;
  let name: string | undefined;
  try {
    const gateway = ipfsToGateway(uri);
    const res = await fetch(gateway);
    const data = (await res.json()) as { name?: string; image?: string };
    name = data.name;
    imageUrl = data.image ? ipfsToGateway(data.image) : undefined;
  } catch {
    // ignore
  }

  const title = name ? `${name} | Moltbook Identity` : `${moltbookId} | Moltbook Identity`;
  const description = name
    ? `Verified Moltbook Identity: ${name}. On-chain profile.`
    : "Verified Moltbook on-chain identity profile.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(imageUrl && { images: [{ url: imageUrl, width: 512, height: 512, alt: name ?? "Profile" }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default function ProfileLayout({ children }: Props) {
  return <>{children}</>;
}
