"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Badge,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";
import { BadgeCheck, ImagePlus, Sparkles, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isLoading, signOut } = useMoltbookAuth();
  const toast = useToast();

  useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/");
    }
  }, [profile, isLoading, router]);

  if (isLoading) return null;
  if (!profile) return null;

  const hasPFP = false; // MVP: no PFP until user generates one

  return (
    <Box minH="100vh" bg="bauhaus.background" py={8}>
      <Container maxW="2xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Link href="/">
              <Heading size="md" color="bauhaus.foreground">
                Profile
              </Heading>
            </Link>
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
            borderRadius="lg"
            p={6}
          >
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text color="text.secondary" fontSize="sm" fontWeight="bold">
                  Profile summary
                </Text>
                <Badge
                  colorScheme="green"
                  bg="bauhaus.green"
                  color="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                >
                  <HStack spacing={1}>
                    <BadgeCheck size={14} />
                    <span>Verified</span>
                  </HStack>
                </Badge>
              </HStack>
              <HStack spacing={4}>
                <Box
                  w="12"
                  h="12"
                  borderRadius="full"
                  bg="bauhaus.orange"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="bauhaus.black"
                  fontWeight="black"
                >
                  {profile.username?.slice(0, 1).toUpperCase() ?? "P"}
                </Box>
                <VStack align="flex-start" spacing={0}>
                  <Text color="bauhaus.foreground" fontWeight="bold">
                    {profile.username ?? profile.profileId}
                  </Text>
                  <Text color="text.secondary" fontSize="sm" fontFamily="mono">
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
            </VStack>
          </Box>

          <Box
            bg="bauhaus.box"
            border="3px solid"
            borderColor="bauhaus.black"
            borderRadius="lg"
            p={6}
          >
            <Text color="text.secondary" fontSize="sm" fontWeight="bold" mb={3}>
              PFP status
            </Text>
            {hasPFP ? (
              <VStack align="stretch" spacing={3}>
                <Box
                  w="24"
                  h="24"
                  borderRadius="lg"
                  bg="bauhaus.smallBox"
                  border="2px solid"
                  borderColor="bauhaus.black"
                />
                <Text color="bauhaus.foreground" fontSize="xs" fontFamily="mono">
                  NFT: 0x…
                </Text>
              </VStack>
            ) : (
              <Text color="bauhaus.foreground" mb={4}>
                No PFP yet. Generate one to mint your identity NFT.
              </Text>
            )}
          </Box>

          <VStack spacing={3} align="stretch">
            <Button
              as={Link}
              href="/generate"
              variant="primary"
              size="lg"
              leftIcon={<ImagePlus size={20} />}
              w="full"
            >
              Generate PFP
            </Button>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Sparkles size={20} />}
              w="full"
              isDisabled={!hasPFP}
              _disabled={{ opacity: 0.6 }}
            >
              Mint NFT (after generating)
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
