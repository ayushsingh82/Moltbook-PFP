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
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../components";
import { BadgeCheck, Copy } from "lucide-react";

// Mock data for display. In production, fetch by moltbook_id.
function useProfileData(moltbookId: string | undefined) {
  if (!moltbookId) return { profile: null };
  return {
    profile: {
      profileId: moltbookId,
      profileType: "human" as const,
      username: `user_${moltbookId.slice(-6)}`,
      nftAddress: "0x1234567890abcdef1234567890abcdef12345678",
      chain: "Base",
      traits: [
        { trait_type: "Role", value: "Human" },
        { trait_type: "Theme", value: "Default" },
      ],
    },
  };
}

export default function ProfileViewPage() {
  const params = useParams();
  const moltbookId = params.moltbook_id as string;
  const { profile } = useProfileData(moltbookId);
  const toast = useToast();

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", status: "success", duration: 2000 });
    }
  };

  if (!moltbookId) {
    return (
      <Box minH="100vh" py={20}>
        <Container maxW="md">
          <Text color="bauhaus.black">Invalid profile.</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          <PageHeader
            title="Profile"
            description="Verified Moltbook identity and NFT details. Share this page to show your on-chain identity."
          />
          <VStack spacing={4}>
            <Box
              w={{ base: "160px", md: "200px" }}
              h={{ base: "160px", md: "200px" }}
              borderRadius="2xl"
              bg="bauhaus.box"
              border="4px solid"
              borderColor="bauhaus.black"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="bauhaus.orange"
              fontWeight="black"
              fontSize={{ base: "5xl", md: "6xl" }}
            >
              P
            </Box>
            <HStack spacing={2}>
              <Heading size="lg" color="bauhaus.black">
                {profile?.username ?? moltbookId}
              </Heading>
              <Badge
                bg="bauhaus.green"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
              >
                <HStack spacing={1}>
                  <BadgeCheck size={14} />
                  <span>Verified Moltbook Identity</span>
                </HStack>
              </Badge>
            </HStack>
          </VStack>

          <Box
            bg="bauhaus.box"
            border="3px solid"
            borderColor="bauhaus.black"
            borderRadius="lg"
            p={5}
          >
            <Text color="bauhaus.orange" fontSize="sm" fontWeight="bold" mb={3}>
              NFT details
            </Text>
            <VStack align="stretch" spacing={2}>
              <HStack justify="space-between">
                <Text color="bauhaus.foreground" fontSize="sm">Chain</Text>
                <Text color="bauhaus.foreground" fontFamily="mono">{profile?.chain ?? "Base"}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="bauhaus.foreground" fontSize="sm">Mint address</Text>
                <Text color="bauhaus.foreground" fontFamily="mono" fontSize="xs" wordBreak="break-all">
                  {profile?.nftAddress ?? "—"}
                </Text>
              </HStack>
              <Box pt={2}>
                <Text color="bauhaus.foreground" fontSize="sm" mb={1}>Traits</Text>
                <HStack flexWrap="wrap" gap={2}>
                  {(profile?.traits ?? []).map((t) => (
                    <Badge key={t.trait_type} colorScheme="gray" px={2} py={1}>
                      {t.trait_type}: {t.value}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </Box>

          <Button
            leftIcon={<Copy size={16} />}
            variant="outline"
            size="md"
            w="full"
            onClick={copyLink}
          >
            Copy profile link
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
