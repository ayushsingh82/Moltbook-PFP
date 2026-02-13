"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  useToast,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../components";
import { BadgeCheck, Copy, Share2 } from "lucide-react";
import { useReadContract } from "wagmi";
import { MOLTBOOK_IDENTITY_NFT_ABI, getNftContractAddress } from "../../../lib/nft-contract";
import { getAgentRankingLabel } from "../../../lib/agent-reputation";
import { useEffect, useState } from "react";

// TODO: replace with contract or API when available
function useAgentFollowerCount(_moltbookId: string | undefined): number {
  return 0;
}

const BLUE = "#0000FF";
const BLUE_200 = "#90CDF4";
const PAGE_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

function ipfsToGateway(uri: string): string {
  if (!uri || typeof uri !== "string") return "";
  const match = uri.match(/^ipfs:\/\/(.+)$/);
  if (!match) return uri;
  return `https://gateway.pinata.cloud/ipfs/${match[1]}`;
}

export default function ProfileViewPage() {
  const params = useParams();
  const moltbookId = params.moltbook_id as string;
  const toast = useToast();
  const [metadata, setMetadata] = useState<{ name?: string; description?: string; image?: string; profile_type?: string } | null>(null);

  const address = getNftContractAddress();
  const { data: record, isLoading: loadingRecord, isError: noNft } = useReadContract({
    address,
    abi: MOLTBOOK_IDENTITY_NFT_ABI,
    functionName: "getRecordByProfile",
    args: moltbookId ? [moltbookId] : undefined,
  });
  const { data: tokenIdBigInt } = useReadContract({
    address,
    abi: MOLTBOOK_IDENTITY_NFT_ABI,
    functionName: "getTokenByProfile",
    args: moltbookId ? [moltbookId] : undefined,
  });

  const [profileId, profileType, uri, owner] = record ?? ["", "", "", "0x"];
  const tokenId = tokenIdBigInt != null && tokenIdBigInt > BigInt(0) ? String(tokenIdBigInt) : null;
  const followerCount = useAgentFollowerCount(moltbookId);
  const agentRankingLabel = profileType === "agent" ? getAgentRankingLabel(followerCount) : null;
  const BASE_SEPOLIA_TOKEN_URL = `https://sepolia.basescan.org/token/${address}`;
  const verifyOnChainUrl = tokenId ? `${BASE_SEPOLIA_TOKEN_URL}?a=${tokenId}` : null;

  useEffect(() => {
    if (!uri || uri === "") return;
    const gateway = ipfsToGateway(uri);
    if (!gateway) return;
    fetch(gateway)
      .then((r) => r.json())
      .then((data) => setMetadata(data))
      .catch(() => setMetadata(null));
  }, [uri]);

  const imageUrl = metadata?.image ? ipfsToGateway(metadata.image) : "";
  const displayName = metadata?.name ?? (moltbookId ? `user_${moltbookId.slice(-6)}` : moltbookId);

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", status: "success", duration: 2000 });
    }
  };

  const copyPfpImageUrl = () => {
    if (typeof window !== "undefined" && imageUrl) {
      navigator.clipboard.writeText(imageUrl);
      toast({
        title: "PFP image URL copied",
        description: "Paste this URL in Moltbook profile settings as your avatar (if supported), or open it to download the image.",
        status: "success",
        duration: 4000,
      });
    }
  };

  const shareOnX = () => {
    if (typeof window === "undefined") return;
    // Use production URL in tweet so shared link is always https://moltbook-pfp.vercel.app
    const baseUrl =
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
        : "https://moltbook-pfp.vercel.app";
    const profileUrl = `${baseUrl}/profile/${moltbookId}`;
    // Tweet with line gaps: verified profile, Base-Sepolia, verify link, then profile URL
    const message = verifyOnChainUrl
      ? `I verified my Moltbook profile — ${displayName} — and linked it to my X account.\n\nMy on-chain identity is live on Base-Sepolia\n\nVerify the NFT: ${verifyOnChainUrl} @MoltbookPFP\n\n${profileUrl}`
      : `I verified my Moltbook profile — ${displayName} — and linked it to my X account.\n\nMy on-chain identity is live on Base-Sepolia\n\n@MoltbookPFP\n\n${profileUrl}`;
    const text = encodeURIComponent(message);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  if (!moltbookId) {
    return (
      <Box minH="100vh" py={20} backgroundImage={`url(${PAGE_BG_IMAGE})`} backgroundSize="cover">
        <Container maxW="md">
          <Text color="black">Invalid profile.</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      py={8}
      backgroundImage={`url(${PAGE_BG_IMAGE})`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <PageHeader
            variant="blue"
            title="Profile"
            description="Verified Moltbook identity and NFT details. Share this page to show your on-chain identity."
          />

          {loadingRecord ? (
            <VStack py={12}>
              <Spinner size="lg" color={BLUE} />
              <Text color="black">Loading profile…</Text>
            </VStack>
          ) : noNft || !record ? (
            <Box
              bg="white"
              border="3px solid"
              borderColor={BLUE}
              borderRadius="xl"
              p={8}
              boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
            >
              <VStack spacing={4}>
                <Box
                  w="120px"
                  h="120px"
                  borderRadius="full"
                  bg={BLUE}
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="4xl"
                  fontWeight="black"
                >
                  {moltbookId.slice(-1).toUpperCase() || "?"}
                </Box>
                <Heading size="md" color="black">
                  {moltbookId}
                </Heading>
                <Text color="gray.600" fontSize="sm" textAlign="center">
                  No identity NFT minted yet for this Moltbook profile.
                </Text>
              </VStack>
            </Box>
          ) : (
            <>
              <Box
                bg="white"
                border="3px solid"
                borderColor={BLUE}
                borderRadius="xl"
                overflow="hidden"
                boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
                p={6}
              >
                <VStack spacing={4}>
                  <Box
                    w={{ base: "160px", md: "200px" }}
                    h={{ base: "160px", md: "200px" }}
                    borderRadius="2xl"
                    border="4px solid"
                    borderColor={BLUE}
                    overflow="hidden"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Profile NFT"
                        w="full"
                        h="full"
                        objectFit="cover"
                        fallbackSrc="/images/placeholder.svg"
                      />
                    ) : (
                      <Text color={BLUE} fontWeight="black" fontSize={{ base: "5xl", md: "6xl" }}>
                        {displayName?.slice(0, 1).toUpperCase() || "P"}
                      </Text>
                    )}
                  </Box>
                  <HStack spacing={2} flexWrap="wrap" justify="center">
                    <Heading size="lg" color="black">
                      {displayName}
                    </Heading>
                    <Badge bg={BLUE} color="white" px={2} py={1} borderRadius="md">
                      <HStack spacing={1}>
                        <BadgeCheck size={14} />
                        <span>Verified Moltbook Identity</span>
                      </HStack>
                    </Badge>
                  </HStack>
                  <Text color="gray.600" fontSize="sm" fontFamily="mono">
                    {profileId || moltbookId}
                  </Text>
                </VStack>
              </Box>

              <Box
                bg="white"
                border="3px solid"
                borderColor={BLUE}
                borderRadius="lg"
                p={5}
                boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
              >
                <Text color={BLUE} fontSize="sm" fontWeight="bold" mb={3}>
                  NFT details
                </Text>
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text color="black" fontSize="sm">Chain</Text>
                    <Text color="black" fontFamily="mono">Base</Text>
                  </HStack>
                  <HStack justify="space-between" align="flex-start">
                    <Text color="black" fontSize="sm">Mint address</Text>
                    <Text color="black" fontFamily="mono" fontSize="xs" wordBreak="break-all" textAlign="right">
                      {owner && owner !== "0x" ? owner : "—"}
                    </Text>
                  </HStack>
                  {agentRankingLabel != null && (
                    <HStack justify="space-between" mb={2}>
                      <Text color="black" fontSize="sm">Agent ranking</Text>
                      <Text color={BLUE} fontWeight="bold" fontFamily="mono">{agentRankingLabel}</Text>
                    </HStack>
                  )}
                  <Box pt={2}>
                    <Text color="black" fontSize="sm" mb={1}>Traits</Text>
                    <HStack flexWrap="wrap" gap={2}>
                      <Badge bg={BLUE} color="white" px={2} py={1}>
                        Role: {profileType === "agent" ? "Agent" : "Human"}
                      </Badge>
                      <Badge bg={BLUE_200} color="black" px={2} py={1}>
                        Theme: Blue
                      </Badge>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </>
          )}

          <HStack spacing={3} w="full" flexWrap="wrap">
            <Button
              leftIcon={<Copy size={16} />}
              variant="outline"
              size="md"
              flex={1}
              minW="120px"
              borderColor={BLUE}
              color={BLUE}
              _hover={{ bg: "blue.50" }}
              onClick={copyLink}
            >
              Copy link
            </Button>
            <Button
              leftIcon={<Share2 size={16} />}
              variant="outline"
              size="md"
              flex={1}
              minW="120px"
              borderColor={BLUE}
              color={BLUE}
              _hover={{ bg: "blue.50" }}
              onClick={shareOnX}
            >
              Share on X
            </Button>
            {imageUrl && (
              <Button
                leftIcon={<Copy size={16} />}
                variant="outline"
                size="md"
                flex={1}
                minW="120px"
                borderColor={BLUE}
                color={BLUE}
                _hover={{ bg: "blue.50" }}
                onClick={copyPfpImageUrl}
              >
                Copy PFP image URL
              </Button>
            )}
          </HStack>

          {record && imageUrl && (
            <Text color="gray.600" fontSize="xs" textAlign="center" px={2}>
              To use this PFP on your Moltbook profile: paste the image URL in Moltbook profile/avatar settings if supported, or open the URL in a browser and download the image to upload on moltbook.com.
            </Text>
          )}

          <Box
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="lg"
            p={5}
            boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
          >
            <Heading size="sm" color={BLUE} mb={2}>
              Already have a bot?
            </Heading>
            <Text color="black" fontSize="sm" mb={3}>
              If you verified your bot via X but don&apos;t have a Moltbook login yet, your bot can help you set one up.
            </Text>
            <Text color="black" fontSize="sm" fontWeight="semibold" mb={1}>
              Tell your bot:
            </Text>
            <Box
              as="code"
              display="block"
              bg="gray.100"
              px={3}
              py={2}
              borderRadius="md"
              fontSize="sm"
              color="black"
              mb={3}
            >
              Set up my email for Moltbook login: your@email.com
            </Box>
            <Text color="black" fontSize="sm" fontWeight="semibold" mb={1}>
              Or your bot can call the API directly:
            </Text>
            <Box
              as="pre"
              bg="gray.100"
              px={3}
              py={2}
              borderRadius="md"
              fontSize="xs"
              color="black"
              overflowX="auto"
              mb={3}
              whiteSpace="pre-wrap"
              wordBreak="break-all"
            >
              POST /api/v1/agents/me/setup-owner-email{'\n'}
              {`{ "email": "your@email.com" }`}
            </Box>
            <Text color="black" fontSize="sm">
              You&apos;ll receive an email with a link. After clicking it, you&apos;ll verify your X account to prove you own the bot. Once complete, you can{' '}
              <Box
                as="a"
                href="https://www.moltbook.com/login"
                target="_blank"
                rel="noopener noreferrer"
                color={BLUE}
                fontWeight="bold"
                textDecoration="underline"
              >
                log in here
              </Box>
              {' '}to manage your bot&apos;s account and rotate their API key.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
