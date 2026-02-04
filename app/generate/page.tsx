"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Select,
  FormControl,
  FormLabel,
  Flex,
  useBreakpointValue,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { PageHeader } from "../../components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";

const THEMES = ["Default", "Dark", "Light", "Ocean", "Sunset"] as const;
const PALETTES = ["Orange & Black", "Blue & White", "Green & Gray", "Purple & Gold"] as const;
const SYMBOLS = ["Circle", "Square", "Hexagon", "Star", "M"] as const;

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

function getSymbolChar(symbol: string): string {
  const map: Record<string, string> = {
    Circle: "●",
    Square: "■",
    Hexagon: "⬡",
    Star: "★",
    M: "M",
  };
  return map[symbol] ?? symbol.slice(0, 1);
}

type MintState = "idle" | "loading" | "success" | "error";

function PFPPreview({
  profileId,
  theme,
  palette,
  symbol,
  size = "260px",
}: {
  profileId: string;
  theme: string;
  palette: string;
  symbol: string;
  size?: string;
}) {
  const colors = PALETTE_COLORS[palette] ?? PALETTE_COLORS["Orange & Black"];
  const bgGradient = THEME_BG[theme] ?? THEME_BG["Default"];
  const symbolChar = getSymbolChar(symbol);
  const isRound = symbol === "Circle" || symbol === "M";
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
    >
      <Box
        w="58%"
        h="58%"
        borderRadius={isRound ? "full" : "lg"}
        bg={colors.accent}
        border="3px solid"
        borderColor="bauhaus.black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={palette === "Blue & White" ? "bauhaus.black" : "white"}
        fontWeight="black"
        fontSize={size === "260px" ? { base: "3xl", md: "4xl", lg: "5xl" } : { base: "2xl", md: "3xl" }}
      >
        {symbolChar}
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
  const [symbol, setSymbol] = useState<string>(SYMBOLS[0]);
  const [mintState, setMintState] = useState<MintState>("idle");
  const [mintAddress, setMintAddress] = useState<string>("");

  useEffect(() => {
    if (!isLoading && !profile) router.replace("/auth");
  }, [profile, isLoading, router]);

  const isStacked = useBreakpointValue({ base: true, lg: false });

  if (isLoading) return null;
  if (!profile) return null;

  const handleRandomize = () => {
    setTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
    setPalette(PALETTES[Math.floor(Math.random() * PALETTES.length)]);
    setSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
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
              <PFPPreview
                profileId={profile.profileId}
                theme={theme}
                palette={palette}
                symbol={symbol}
                size="160px"
              />
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
        <VStack spacing={8} align="stretch">
          <PageHeader
            title="Generate & mint your identity PFP"
            description="Customize your PFP below, then review and mint to chain. One page, one flow."
          />

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
                Customize & preview
              </Text>
            </Box>
            <Flex
              direction={isStacked ? "column" : "row"}
              align={isStacked ? "stretch" : "stretch"}
              gap={0}
              minH={{ lg: "400px" }}
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
                  <FormControl>
                    <FormLabel color="bauhaus.foreground" fontSize="sm" fontWeight="bold">Icon / symbol</FormLabel>
                    <Select
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      bg="bauhaus.background"
                      border="2px solid"
                      borderColor="bauhaus.black"
                      color="bauhaus.foreground"
                      size="md"
                    >
                      {SYMBOLS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
                  </FormControl>
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
                alignItems="center"
                justifyContent="center"
                bg="bauhaus.background"
                minH={{ base: "320px", lg: "auto" }}
              >
                <PFPPreview profileId={profile.profileId} theme={theme} palette={palette} symbol={symbol} />
              </Box>
            </Flex>
          </Box>

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
                  <PFPPreview
                    profileId={profile.profileId}
                    theme={theme}
                    palette={palette}
                    symbol={symbol}
                    size="160px"
                  />
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
        </VStack>
      </Container>
    </Box>
  );
}
