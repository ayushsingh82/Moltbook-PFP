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
import { BadgeCheck, Copy } from "lucide-react";
import { useReadContract } from "wagmi";
import { MOLTBOOK_IDENTITY_NFT_ABI, getNftContractAddress } from "../../../lib/nft-contract";
import { useEffect, useState } from "react";

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

  const [profileId, profileType, uri, owner] = record ?? ["", "", "", "0x"];

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

          <Button
            leftIcon={<Copy size={16} />}
            variant="outline"
            size="md"
            w="full"
            borderColor={BLUE}
            color={BLUE}
            _hover={{ bg: "blue.50" }}
            onClick={copyLink}
          >
            Copy profile link
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
