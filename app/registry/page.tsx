"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  HStack,
  Link as ChakraLink,
  Spinner,
  Image,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
} from "@chakra-ui/react";
import Link from "next/link";
import { PageHeader } from "../../components";
import { ExternalLink, Bot, Info } from "lucide-react";
import { useReadContract } from "wagmi";
import { MOLTBOOK_IDENTITY_NFT_ABI, getNftContractAddress } from "../../lib/nft-contract";
import { getAgentReputation } from "../../lib/agent-reputation";
import { useEffect, useState } from "react";

const BLUE = "#0000FF";
const SHADOW_LIGHT_BLUE = "#ADD8E6";
const PAGE_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

const MAX_RECORDS = BigInt(100);

function ipfsToGateway(uri: string): string {
  if (!uri || typeof uri !== "string") return "";
  const match = uri.match(/^ipfs:\/\/(.+)$/);
  if (!match) return uri;
  return `https://gateway.pinata.cloud/ipfs/${match[1]}`;
}

function truncateAddress(addr: string, start = 6, end = 4) {
  if (addr.length <= start + end) return addr;
  return `${addr.slice(0, start)}…${addr.slice(-end)}`;
}

/** Stats shown in score info popover. Fill from API when available. */
interface ScoreInfoStats {
  followers?: number;
  following?: number;
  posts?: number;
  interactions?: number;
}

function ScoreInfoButton({
  scoreLabel,
  profileId,
  stats,
}: {
  scoreLabel: string;
  profileId: string;
  stats: ScoreInfoStats;
}) {
  const {
    followers = 0,
    following = 0,
    posts = 0,
    interactions = 0,
  } = stats;

  return (
    <Popover trigger="click" placement="left" isLazy>
      <PopoverTrigger>
        <Button
          size="sm"
          variant="outline"
          borderColor={BLUE}
          color={BLUE}
          fontFamily="mono"
          fontWeight="bold"
          rightIcon={<Info size={14} />}
          _hover={{ bg: "blue.50" }}
        >
          {scoreLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        border="2px solid"
        borderColor={BLUE}
        borderRadius="lg"
        _focus={{ outline: "none" }}
        w="auto"
        minW="200px"
      >
        <PopoverHeader
          borderBottom="1px solid"
          borderColor="gray.200"
          fontWeight="bold"
          fontSize="sm"
          color={BLUE}
          py={2}
          px={4}
        >
          Reputation & activity
        </PopoverHeader>
        <PopoverBody py={3} px={4}>
          <VStack align="stretch" spacing={2} fontSize="sm">
            <HStack justify="space-between">
              <Text color="gray.600">Score</Text>
              <Text fontWeight="bold" color={BLUE}>{scoreLabel}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Followers</Text>
              <Text fontWeight="medium">{followers}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Following</Text>
              <Text fontWeight="medium">{following}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Posts</Text>
              <Text fontWeight="medium">{posts}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.600">Interactions</Text>
              <Text fontWeight="medium">{interactions}</Text>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

function RegistryPFP({ uri, profileId }: { uri: string; profileId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!uri) return;
    const metaUrl = ipfsToGateway(uri);
    if (!metaUrl) return;
    fetch(metaUrl)
      .then((r) => r.json())
      .then((data) => {
        const img = data?.image;
        if (img) setImageUrl(ipfsToGateway(img));
      })
      .catch(() => {});
  }, [uri]);
  const initial = profileId?.slice(-1).toUpperCase() || "?";
  return (
    <ChakraLink as={Link} href={`/profile/${profileId}`} display="inline-flex" _hover={{ opacity: 0.9 }}>
      <Box
        w="10"
        h="10"
        borderRadius="lg"
        border="2px solid"
        borderColor={BLUE}
        overflow="hidden"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {imageUrl ? (
          <Image src={imageUrl} alt="" w="full" h="full" objectFit="cover" />
        ) : (
          <Text color={BLUE} fontWeight="bold" fontSize="md">{initial}</Text>
        )}
      </Box>
    </ChakraLink>
  );
}

export default function RegistryPage() {
  const address = getNftContractAddress();

  const { data: totalSupply, isLoading: loadingSupply } = useReadContract({
    address,
    abi: MOLTBOOK_IDENTITY_NFT_ABI,
    functionName: "totalSupply",
  });

  const { data: recordsData, isLoading: loadingRecords } = useReadContract({
    address,
    abi: MOLTBOOK_IDENTITY_NFT_ABI,
    functionName: "getAllRecords",
    args: [BigInt(0), MAX_RECORDS],
  });

  const total = totalSupply ?? BigInt(0);
  const [tokenIds = [], profileIds = [], profileTypes = [], uris = [], owners = []] = recordsData ?? [];
  const registry = tokenIds.map((_, i) => ({
    tokenId: tokenIds[i],
    profileId: profileIds[i] ?? "",
    profileType: profileTypes[i] ?? "human",
    owner: owners[i] ?? "0x",
    uri: uris[i] ?? "",
  })).filter((r) => r.profileId);

  // Follower count per profile not in contract; use 0 so score = 1. When >= 20, agent-reputation.ts gives 2.
  const followerCountByProfileId: Record<string, number> = {};
  function getScore(row: { profileId: string }): string {
    const count = followerCountByProfileId[row.profileId] ?? 0;
    return String(getAgentReputation(count));
  }

  const isLoading = loadingSupply || loadingRecords;

  return (
    <Box
      minH="100vh"
      py={8}
      color="black"
      backgroundImage={`url(${PAGE_BG_IMAGE})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Container maxW="5xl">
        <VStack spacing={8} align="stretch">
          <PageHeader
            variant="blue"
            title="Registry"
            description="Moltbook profile IDs mapped to NFT mint addresses. Data read from chain."
          />

          <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <Text color={BLUE} fontSize="sm" fontWeight="bold">
              {isLoading ? (
                <HStack spacing={2}>
                  <Spinner size="sm" />
                  <span>Loading…</span>
                </HStack>
              ) : (
                `${Number(total)} identit${Number(total) === 1 ? "y" : "ies"} on chain`
              )}
            </Text>
          </HStack>

          <TableContainer
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="xl"
            overflowX="auto"
            boxShadow={`6px 6px 0px 0px ${SHADOW_LIGHT_BLUE}`}
          >
            <Table size="md" variant="unstyled">
              <Thead>
                <Tr
                  bg={BLUE}
                  borderBottom="3px solid"
                  borderColor={BLUE}
                >
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                    w="56px"
                  >
                    Profile
                  </Th>
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                  >
                    Moltbook Profile ID
                  </Th>
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                  >
                    Owner (NFT mint address)
                  </Th>
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                    isNumeric
                  >
                    Profile Type
                  </Th>
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                    isNumeric
                  >
                    Score
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={5} py={12} textAlign="center" color="gray.500">
                      <Spinner size="md" mr={2} />
                      Loading registry from contract…
                    </Td>
                  </Tr>
                ) : registry.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} py={12} textAlign="center" color="gray.500">
                      No identities minted yet.
                    </Td>
                  </Tr>
                ) : (
                  registry.map((row) => (
                    <Tr
                      key={`${row.profileId}-${row.tokenId}`}
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      _last={{ borderBottom: "none" }}
                      _hover={{ bg: "gray.50" }}
                      transition="background 0.15s"
                    >
                      <Td py={4} px={3}>
                        <RegistryPFP uri={row.uri} profileId={row.profileId} />
                      </Td>
                      <Td
                        color="black"
                        fontFamily="mono"
                        fontSize="sm"
                        fontWeight="medium"
                        py={4}
                        px={5}
                      >
                        <ChakraLink
                          as={Link}
                          href={`/profile/${row.profileId}`}
                          color={BLUE}
                          _hover={{ textDecoration: "underline" }}
                        >
                          {row.profileId}
                        </ChakraLink>
                      </Td>
                      <Td
                        color="black"
                        fontFamily="mono"
                        fontSize="xs"
                        py={4}
                        px={5}
                        title={row.owner}
                      >
                        <HStack spacing={2} display="inline-flex" align="center">
                          <span>{truncateAddress(row.owner, 10, 8)}</span>
                          <ChakraLink
                            as="a"
                            href={`https://sepolia.basescan.org/address/${row.owner}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View owner"
                            color={BLUE}
                            _hover={{ color: BLUE, opacity: 0.8 }}
                            display="inline-flex"
                          >
                            <ExternalLink size={14} />
                          </ChakraLink>
                        </HStack>
                      </Td>
                      <Td py={4} px={5} isNumeric>
                        <Badge
                          bg={BLUE}
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          {row.profileType}
                        </Badge>
                      </Td>
                      <Td py={4} px={5} isNumeric>
                        <ScoreInfoButton
                          scoreLabel={getScore(row)}
                          profileId={row.profileId}
                          stats={{
                            followers: followerCountByProfileId[row.profileId] ?? 0,
                            following: 0,
                            posts: 0,
                            interactions: 0,
                          }}
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Agents - Coming soon */}
          <Box
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="xl"
            overflow="hidden"
            boxShadow={`6px 6px 0px 0px ${SHADOW_LIGHT_BLUE}`}
            p={6}
          >
            <HStack spacing={3} mb={2}>
              <Bot size={24} color={BLUE} />
              <Text color={BLUE} fontWeight="bold" fontSize="lg">
                Agent registry
              </Text>
              <Badge
                bg="gray.400"
                color="white"
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="xs"
                fontWeight="bold"
              >
                Coming soon
              </Badge>
            </HStack>
            <Text color="gray.600" fontSize="sm">
              Agent profiles and NFT mint addresses will appear here once the agent registry is live.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
