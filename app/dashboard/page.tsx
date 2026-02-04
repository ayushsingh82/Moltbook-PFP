"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";
import Link from "next/link";
import { PageHeader } from "../../components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";
import { BadgeCheck, ImagePlus, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isLoading, signOut } = useMoltbookAuth();

  useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/auth");
    }
  }, [profile, isLoading, router]);

  if (isLoading) return null;
  if (!profile) return null;

  const hasPFP = false;

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="3xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
            <PageHeader
              title="Dashboard"
              description="Your Moltbook profile and PFP status. Generate and mint your identity NFT in one flow."
            />
            <Button
              size="sm"
              variant="outline"
              leftIcon={<LogOut size={16} />}
              onClick={() => {
                signOut();
                router.replace("/");
              }}
            >
              Sign out
            </Button>
          </HStack>

          <Box
            bg="bauhaus.box"
            border="3px solid"
            borderColor="bauhaus.black"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="6px 6px 0px 0px #121212"
          >
            <Box
              bg="bauhaus.smallBox"
              borderBottom="3px solid"
              borderColor="bauhaus.black"
              px={5}
              py={3}
            >
              <Text
                color="bauhaus.smallBoxText"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                fontSize="xs"
              >
                Dashboard
              </Text>
            </Box>
            <VStack align="stretch" spacing={0} p={6}>
              {/* Profile summary */}
              <HStack spacing={4} pb={6} borderBottom="2px solid" borderColor="whiteAlpha.100">
                <Box
                  w="14"
                  h="14"
                  borderRadius="full"
                  bg="bauhaus.orange"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="bauhaus.black"
                  fontWeight="black"
                  fontSize="xl"
                  border="2px solid"
                  borderColor="bauhaus.black"
                >
                  {profile.username?.slice(0, 1).toUpperCase() ?? "P"}
                </Box>
                <VStack align="flex-start" spacing={0} flex={1}>
                  <HStack spacing={2}>
                    <Text color="bauhaus.foreground" fontWeight="bold" fontSize="lg">
                      {profile.username ?? profile.profileId}
                    </Text>
                    <Badge
                      bg="bauhaus.green"
                      color="white"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      fontSize="xs"
                    >
                      <HStack spacing={1}>
                        <BadgeCheck size={12} />
                        <span>Verified</span>
                      </HStack>
                    </Badge>
                  </HStack>
                  <Text color="bauhaus.foreground" fontSize="sm" fontFamily="mono">
                    {profile.profileId}
                  </Text>
                  <Badge
                    size="sm"
                    colorScheme={profile.profileType === "agent" ? "purple" : "blue"}
                    mt={1}
                  >
                    {profile.profileType === "agent" ? "Agent" : "Human"}
                  </Badge>
                </VStack>
              </HStack>

              {/* PFP status */}
              <Box py={6} borderBottom="2px solid" borderColor="whiteAlpha.100">
                {hasPFP ? (
                  <HStack spacing={4} align="center">
                    <Box
                      w="20"
                      h="20"
                      borderRadius="lg"
                      bg="bauhaus.smallBox"
                      border="2px solid"
                      borderColor="bauhaus.black"
                    />
                    <VStack align="flex-start" spacing={0}>
                      <Text color="bauhaus.foreground" fontSize="sm" fontWeight="bold">
                        Identity NFT minted
                      </Text>
                      <Text color="bauhaus.foreground" fontSize="xs" fontFamily="mono">
                        NFT: 0x…
                      </Text>
                    </VStack>
                  </HStack>
                ) : (
                  <Text color="bauhaus.foreground">
                    No PFP yet. Generate one to mint your identity NFT.
                  </Text>
                )}
              </Box>

              {/* Actions */}
              <VStack spacing={3} pt={6} align="stretch">
                <Button
                  as={Link}
                  href="/generate"
                  variant="primary"
                  size="lg"
                  leftIcon={<ImagePlus size={20} />}
                  w="full"
                >
                  Generate & mint PFP
                </Button>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
