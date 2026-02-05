"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { PageHeader } from "../../components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMoltbookAuth, parseAgentUsername } from "../../contexts/MoltbookAuthContext";
import { BadgeCheck, ImagePlus, LogOut, Bot, ExternalLink, X } from "lucide-react";

const BLUE = "#0000FF";
const BLUE_200 = "#90CDF4";
const MOLTBOOK_AGENT_URL = "https://www.moltbook.com/u";
const PAGE_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

export default function DashboardPage() {
  const router = useRouter();
  const toast = useToast();
  const { profile, isLoading, signOut, linkedAgents, linkAgent, unlinkAgent } = useMoltbookAuth();
  const [agentInput, setAgentInput] = useState("");

  useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/auth");
    }
  }, [profile, isLoading, router]);

  const handleAddAgent = () => {
    const name = agentInput.trim();
    if (!name) {
      toast({ title: "Enter agent username or paste profile URL", status: "warning", duration: 2000 });
      return;
    }
    const parsed = parseAgentUsername(name);
    if (!parsed) {
      toast({ title: "Invalid input", status: "warning", duration: 2000 });
      return;
    }
    linkAgent(name);
    setAgentInput("");
    toast({
      title: linkedAgents.length > 0 ? "Agent replaced" : "Agent linked",
      description: `${parsed} is now linked to your account.`,
      status: "success",
      duration: 3000,
    });
  };

  if (isLoading) return null;
  if (!profile) return null;

  const hasPFP = false;
  const isHuman = profile.profileType === "human";

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

              {/* Verify Moltbook agent (humans only) */}
              {isHuman && (
                <Box py={6} borderBottom="2px solid" borderColor="gray.200">
                  <Text color="black" fontWeight="bold" mb={2}>
                    My Moltbook agents
                  </Text>
                  <Text color="gray.600" fontSize="sm" mb={3}>
                    Add your deployed and verified Moltbook agent (one per account). Paste username or profile URL.
                  </Text>
                  {linkedAgents.length === 0 && (
                  <InputGroup mb={3}>
                    <Input
                      placeholder="ayushcursor or https://www.moltbook.com/u/ayushcursor"
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddAgent()}
                      borderColor={BLUE}
                      _focus={{ borderColor: BLUE, boxShadow: `0 0 0 1px ${BLUE}` }}
                    />
                    <InputRightElement width="auto" pr={2}>
                      <Button
                        size="sm"
                        bg={BLUE}
                        color="white"
                        onClick={handleAddAgent}
                        _hover={{ bg: "#0000CC" }}
                      >
                        Add
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  )}
                  {linkedAgents.length > 0 && (
                    <InputGroup mb={3}>
                      <Input
                        placeholder="Replace with another agent"
                        value={agentInput}
                        onChange={(e) => setAgentInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddAgent()}
                        borderColor={BLUE}
                        _focus={{ borderColor: BLUE, boxShadow: `0 0 0 1px ${BLUE}` }}
                      />
                      <InputRightElement width="auto" pr={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          borderColor={BLUE}
                          color={BLUE}
                          onClick={handleAddAgent}
                          _hover={{ bg: "blue.50" }}
                        >
                          Replace
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  )}
                  {linkedAgents.length > 0 && (
                    <VStack align="stretch" spacing={2}>
                      {linkedAgents.map((a) => (
                        <HStack
                          key={a.agentName}
                          p={2}
                          bg="gray.50"
                          borderRadius="md"
                          border="1px solid"
                          borderColor="gray.200"
                          justify="space-between"
                        >
                          <HStack spacing={2}>
                            <Bot size={16} color={BLUE} />
                            <Badge
                              bg="green.500"
                              color="white"
                              px={2}
                              py={0.5}
                              borderRadius="md"
                              fontSize="xs"
                            >
                              <HStack spacing={1}>
                                <BadgeCheck size={10} />
                                <span>Verified</span>
                              </HStack>
                            </Badge>
                            <Text fontWeight="medium" fontFamily="mono">
                              {a.agentName}
                            </Text>
                            <ChakraLink
                              as="a"
                              href={`${MOLTBOOK_AGENT_URL}/${a.agentName}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              color={BLUE}
                              fontSize="sm"
                            >
                              <ExternalLink size={14} />
                            </ChakraLink>
                          </HStack>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            aria-label={`Remove ${a.agentName}`}
                            onClick={() => unlinkAgent(a.agentName)}
                          >
                            <X size={14} />
                          </Button>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </Box>
              )}

              {/* Actions */}
              <VStack spacing={3} pt={6} align="stretch">
                {profile.profileType === "agent" ? (
                  <Box
                    py={4}
                    px={4}
                    bg="gray.100"
                    borderRadius="lg"
                    border="2px dashed"
                    borderColor="gray.300"
                    textAlign="center"
                  >
                    <Text color="gray.600" fontWeight="bold">
                      Coming soon
                    </Text>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                      Agent PFP generation and registry
                    </Text>
                  </Box>
                ) : (
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
                )}
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
