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

const BLUE = "#0000FF";
const BLUE_200 = "#90CDF4";

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
    <Box minH="100vh" py={8} bg="white" color="black">
      <Container maxW="3xl">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
            <PageHeader
              variant="blue"
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
              color={BLUE}
              borderColor={BLUE}
              _hover={{ bg: "blue.50" }}
            >
              Sign out
            </Button>
          </HStack>

          <Box
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="xl"
            overflow="hidden"
            boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
          >
            <Box
              bg={BLUE}
              borderBottom="3px solid"
              borderColor={BLUE}
              px={5}
              py={3}
            >
              <Text
                color="white"
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
              <HStack spacing={4} pb={6} borderBottom="2px solid" borderColor="gray.200">
                <Box
                  w="14"
                  h="14"
                  borderRadius="full"
                  bg={BLUE}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="black"
                  fontSize="xl"
                  border="2px solid"
                  borderColor={BLUE}
                >
                  {profile.username?.slice(0, 1).toUpperCase() ?? "P"}
                </Box>
                <VStack align="flex-start" spacing={0} flex={1}>
                  <HStack spacing={2}>
                    <Text color="black" fontWeight="bold" fontSize="lg">
                      {profile.username ?? profile.profileId}
                    </Text>
                    <Badge
                      bg="green.500"
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
                  <Text color="gray.700" fontSize="sm" fontFamily="mono">
                    {profile.profileId}
                  </Text>
                  <Badge
                    size="sm"
                    bg={BLUE}
                    color="white"
                    mt={1}
                  >
                    {profile.profileType === "agent" ? "Agent" : "Human"}
                  </Badge>
                </VStack>
              </HStack>

              {/* PFP status */}
              <Box py={6} borderBottom="2px solid" borderColor="gray.200">
                {hasPFP ? (
                  <HStack spacing={4} align="center">
                    <Box
                      w="20"
                      h="20"
                      borderRadius="lg"
                      bg="gray.100"
                      border="2px solid"
                      borderColor={BLUE}
                    />
                    <VStack align="flex-start" spacing={0}>
                      <Text color="black" fontSize="sm" fontWeight="bold">
                        Identity NFT minted
                      </Text>
                      <Text color="gray.700" fontSize="xs" fontFamily="mono">
                        NFT: 0x…
                      </Text>
                    </VStack>
                  </HStack>
                ) : (
                  <Text color="black">
                    No PFP yet. Generate one to mint your identity NFT.
                  </Text>
                )}
              </Box>

              {/* Actions */}
              <VStack spacing={3} pt={6} align="stretch">
                <Button
                  as={Link}
                  href="/generate"
                  bg={BLUE}
                  color="white"
                  size="lg"
                  leftIcon={<ImagePlus size={20} />}
                  w="full"
                  _hover={{ bg: "#0000CC" }}
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
