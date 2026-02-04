"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
  useBreakpointValue,
  Spinner,
  useToast,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";
import { PageHeader } from "../../components";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";

const THEMES = ["Default", "Dark", "Light", "Ocean", "Sunset"] as const;
const PALETTES = ["Orange & Black", "Blue & White", "Green & Gray", "Purple & Gold"] as const;

const PALETTE_COLORS: Record<string, { bg: string; accent: string }> = {
  "Orange & Black": { bg: "#121212", accent: "#F97316" },
  "Blue & White": { bg: "#1a365d", accent: "#ffffff" },
  "Green & Gray": { bg: "#1a2f1a", accent: "#48BB78" },
  "Purple & Gold": { bg: "#2d1b4e", accent: "#D69E2E" },
};

const THEME_BG: Record<string, string> = {
  Default: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)",
  Dark: "linear-gradient(145deg, #0d0d0d 0%, #1a1a1a 100%)",
  Light: "linear-gradient(145deg, #2d2d2d 0%, #4a4a4a 100%)",
  Ocean: "linear-gradient(145deg, #0c2d48 0%, #1a4d6e 100%)",
  Sunset: "linear-gradient(145deg, #4a1c1c 0%, #6b2d2d 100%)",
};

// All agent images from public/images/ (hero-image01–10)
const AGENT_IMAGES = [
  { id: "agent-1", src: "/images/hero-image01.svg", label: "Agent 1" },
  { id: "agent-2", src: "/images/hero-image02.svg", label: "Agent 2" },
  { id: "agent-3", src: "/images/hero-image03.svg", label: "Agent 3" },
  { id: "agent-4", src: "/images/hero-image04.svg", label: "Agent 4" },
  { id: "agent-5", src: "/images/hero-image05.svg", label: "Agent 5" },
  { id: "agent-6", src: "/images/hero-image06.svg", label: "Agent 6" },
  { id: "agent-7", src: "/images/hero-image07.svg", label: "Agent 7" },
  { id: "agent-8", src: "/images/hero-image08.svg", label: "Agent 8" },
  { id: "agent-9", src: "/images/hero-image09.svg", label: "Agent 9" },
  { id: "agent-10", src: "/images/hero-image10.svg", label: "Agent 10" },
] as const;

type MintState = "idle" | "loading" | "success" | "error";

function AgentCard({
  src,
  label,
  isSelected,
  onSelect,
}: {
  src: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onSelect}
      w="full"
      aspectRatio="1"
      maxW="100px"
      borderRadius="lg"
      border="2px solid"
      borderColor={isSelected ? "bauhaus.orange" : "bauhaus.black"}
      bg="bauhaus.background"
      overflow="hidden"
      boxShadow="4px 4px 0 0 #121212"
      _hover={{ borderColor: "bauhaus.orange" }}
    >
      <Image
        src={src}
        fallbackSrc="/images/placeholder.svg"
        alt={label}
        w="full"
        h="full"
        objectFit="contain"
      />
    </Box>
  );
}

function PFPPreview({
  theme,
  palette,
  agentSrc,
  size = "260px",
}: {
  theme: string;
  palette: string;
  agentSrc: string;
  size?: string;
}) {
  const colors = PALETTE_COLORS[palette] ?? PALETTE_COLORS["Orange & Black"];
  const bgGradient = THEME_BG[theme] ?? THEME_BG["Default"];
  const resolvedSize = useBreakpointValue(
    size === "260px" ? { base: "180px", sm: "220px", md: "260px", lg: "280px" } : { base: "120px", md: "160px" }
  ) ?? (size === "260px" ? "260px" : "160px");

  return (
    <Box
      w={resolvedSize}
      h={resolvedSize}
      flexShrink={0}
      borderRadius="2xl"
      border="4px solid"
      borderColor="bauhaus.black"
      bg={colors.bg}
      backgroundImage={bgGradient}
      backgroundSize="cover"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="6px 6px 0px 0px #121212"
      overflow="hidden"
    >
      <Box
        w="70%"
        h="70%"
        borderRadius="xl"
        border="3px solid"
        borderColor={colors.accent}
        overflow="hidden"
        bg="bauhaus.background"
      >
        <Image
          src={agentSrc}
          fallbackSrc="/images/placeholder.svg"
          alt="PFP"
          w="full"
          h="full"
          objectFit="cover"
        />
      </Box>
    </Box>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const toast = useToast();
  const { profile, isLoading } = useMoltbookAuth();
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [palette, setPalette] = useState<string>(PALETTES[0]);
  const [selectedAgent, setSelectedAgent] = useState<(typeof AGENT_IMAGES)[number]>(AGENT_IMAGES[0]);
  const [mintState, setMintState] = useState<MintState>("idle");
  const [mintAddress, setMintAddress] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !profile) router.replace("/auth");
  }, [profile, isLoading, router]);

  const isStacked = useBreakpointValue({ base: true, lg: false });

  if (isLoading) return null;
  if (!profile) return null;

  const handleRandomize = () => {
    setTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
    setPalette(PALETTES[Math.floor(Math.random() * PALETTES.length)]);
    setSelectedAgent(AGENT_IMAGES[Math.floor(Math.random() * AGENT_IMAGES.length)]);
  };

  const handleDownload = () => {
    if (!previewRef.current) return;
    toPng(previewRef.current, { pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "a2base-pfp.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        toast({ title: "Download failed", status: "error", duration: 3000 });
      });
  };

  const handleMint = async () => {
    setMintState("loading");
    try {
      await new Promise((r) => setTimeout(r, 2500));
      const mockAddress = `0x${Date.now().toString(16).slice(-40)}`;
      setMintAddress(mockAddress);
      setMintState("success");
      toast({
        title: "NFT minted",
        description: "Your identity PFP is on chain.",
        status: "success",
        duration: 5000,
      });
    } catch {
      setMintState("error");
      toast({ title: "Mint failed", status: "error", duration: 5000 });
    }
  };

  if (mintState === "success") {
    return (
      <Box minH="100vh" py={8}>
        <Container maxW="lg">
          <PageHeader
            title="Minted successfully"
            description="Your identity PFP is now on chain. View your profile below."
          />
          <Box
            bg="bauhaus.box"
            border="3px solid"
            borderColor="bauhaus.black"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="6px 6px 0px 0px #121212"
            mt={6}
          >
            <VStack spacing={6} p={8}>
              <PFPPreview theme={theme} palette={palette} agentSrc={selectedAgent.src} size="160px" />
              <Text color="bauhaus.foreground" fontWeight="bold">
                Your identity NFT is on chain
              </Text>
              <Box
                w="full"
                p={3}
                bg="bauhaus.background"
                borderRadius="md"
                border="2px solid"
                borderColor="bauhaus.black"
              >
                <Text color="bauhaus.foreground" fontSize="xs" fontFamily="mono" wordBreak="break-all">
                  {mintAddress}
                </Text>
              </Box>
              <Button as={Link} href={`/profile/${profile.profileId}`} variant="primary" size="lg" w="full">
                View profile
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="5xl">
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
            py={4}
          >
            <Text color="bauhaus.smallBoxText" fontWeight="bold" fontSize="lg" textTransform="uppercase" letterSpacing="wider">
              Generate & mint your identity PFP
            </Text>
          </Box>

          <Box
            bg="bauhaus.smallBox"
            borderBottom="3px solid"
            borderColor="bauhaus.black"
            px={5}
            py={3}
            textAlign="center"
          >
            <Text color="white" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" fontSize="xs">
              Customize & preview
            </Text>
          </Box>

          <Flex
            direction={isStacked ? "column" : "row"}
            align={isStacked ? "stretch" : "stretch"}
            minH={{ lg: "420px" }}
          >
            <Box
              flex={1}
              p={{ base: 5, md: 6 }}
              borderRight={isStacked ? "none" : "3px solid"}
              borderBottom={isStacked ? "3px solid" : "none"}
              borderColor="bauhaus.black"
            >
              <VStack align="stretch" spacing={5}>
                <FormControl>
                  <FormLabel color="bauhaus.foreground" fontSize="sm" fontWeight="bold">Theme</FormLabel>
                  <Select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    bg="bauhaus.background"
                    border="2px solid"
                    borderColor="bauhaus.black"
                    color="bauhaus.foreground"
                    size="md"
                  >
                    {THEMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color="bauhaus.foreground" fontSize="sm" fontWeight="bold">Color palette</FormLabel>
                  <Select
                    value={palette}
                    onChange={(e) => setPalette(e.target.value)}
                    bg="bauhaus.background"
                    border="2px solid"
                    borderColor="bauhaus.black"
                    color="bauhaus.foreground"
                    size="md"
                  >
                    {PALETTES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                </FormControl>
                <Box>
                  <FormLabel color="bauhaus.foreground" fontSize="sm" fontWeight="bold" mb={2}>Agent image</FormLabel>
                  <SimpleGrid columns={4} spacing={2}>
                    {AGENT_IMAGES.map((agent) => (
                      <AgentCard
                        key={agent.id}
                        src={agent.src}
                        label={agent.label}
                        isSelected={selectedAgent.id === agent.id}
                        onSelect={() => setSelectedAgent(agent)}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleRandomize}
                  color="white"
                  borderColor="white"
                  _hover={{ color: "white", borderColor: "white", bg: "whiteAlpha.200" }}
                >
                  Regenerate
                </Button>
              </VStack>
            </Box>
            <Box
              flex={1}
              p={{ base: 6, md: 8 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              bg="bauhaus.background"
              minH={{ base: "320px", lg: "auto" }}
            >
              <VStack spacing={4}>
                <Box ref={previewRef} display="inline-block">
                  <PFPPreview theme={theme} palette={palette} agentSrc={selectedAgent.src} />
                </Box>
                <Button
                  size="md"
                  variant="outline"
                  leftIcon={<Download size={18} />}
                  onClick={handleDownload}
                  color="bauhaus.foreground"
                  borderColor="bauhaus.black"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Download
                </Button>
              </VStack>
            </Box>
          </Flex>

          <Box bg="bauhaus.smallBox" borderBottom="3px solid" borderColor="bauhaus.black" px={5} py={3} textAlign="center">
            <Text color="white" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" fontSize="xs">
              Review & mint
            </Text>
          </Box>
          <VStack align="stretch" spacing={0}>
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "center", md: "stretch" }}
              gap={6}
              p={6}
              borderBottom="3px solid"
              borderColor="bauhaus.black"
            >
              <Box flexShrink={0}>
                <Text color="bauhaus.orange" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                  Final PFP
                </Text>
                <PFPPreview theme={theme} palette={palette} agentSrc={selectedAgent.src} size="160px" />
              </Box>
              <Box flex={1} minW={0}>
                <Text color="bauhaus.orange" fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                  Metadata (on-chain)
                </Text>
                <Box
                  as="pre"
                  fontSize="xs"
                  fontFamily="mono"
                  color="bauhaus.foreground"
                  whiteSpace="pre-wrap"
                  p={4}
                  bg="bauhaus.background"
                  borderRadius="md"
                  border="2px solid"
                  borderColor="bauhaus.black"
                >
                  {JSON.stringify(
                    {
                      name: "Moltbook Identity",
                      description: "Verified Moltbook profile PFP",
                      moltbook_profile_id: profile.profileId,
                      profile_type: profile.profileType,
                    },
                    null,
                    2
                  )}
                </Box>
              </Box>
            </Flex>
            {mintState === "error" && (
              <Box px={6} py={3} bg="red.900" color="red.200" fontSize="sm">
                Mint failed. Try again.
              </Box>
            )}
            <Box p={6}>
              <Button
                variant="primary"
                size="lg"
                w="full"
                onClick={handleMint}
                isLoading={mintState === "loading"}
                loadingText="Minting…"
                leftIcon={mintState === "loading" ? <Spinner size="sm" /> : undefined}
              >
                Mint NFT
              </Button>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
