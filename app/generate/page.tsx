"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";

const THEMES = ["Default", "Dark", "Light", "Ocean", "Sunset"] as const;
const PALETTES = ["Orange & Black", "Blue & White", "Green & Gray", "Purple & Gold"] as const;
const SYMBOLS = ["Circle", "Square", "Hexagon", "Star", "M"] as const;

// Deterministic placeholder "PFP" based on profile ID + traits (SVG)
function PFPPreview({
  profileId,
  theme,
  palette,
  symbol,
}: {
  profileId: string;
  theme: string;
  palette: string;
  symbol: string;
}) {
  const seed = useMemo(() => {
    const s = `${profileId}-${theme}-${palette}-${symbol}`;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return Math.abs(h) % 360;
  }, [profileId, theme, palette, symbol]);

  const bg = `hsl(${seed % 360}, 60%, 18%)`;
  const accent = "var(--chakra-colors-bauhaus-orange)";

  return (
    <Box
      w={{ base: "200px", md: "280px" }}
      h={{ base: "200px", md: "280px" }}
      borderRadius="2xl"
      border="4px solid"
      borderColor="bauhaus.black"
      bg={bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="6px 6px 0px 0px #121212"
    >
      <Box
        w="60%"
        h="60%"
        borderRadius="full"
        bg={accent}
        border="3px solid"
        borderColor="bauhaus.black"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="bauhaus.black"
        fontWeight="black"
        fontSize={{ base: "4xl", md: "5xl" }}
      >
        {symbol.slice(0, 1)}
      </Box>
    </Box>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const { profile, isLoading } = useMoltbookAuth();
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [palette, setPalette] = useState<string>(PALETTES[0]);
  const [symbol, setSymbol] = useState<string>(SYMBOLS[0]);

  useEffect(() => {
    if (!isLoading && !profile) router.replace("/");
  }, [profile, isLoading, router]);

  if (isLoading) return null;
  if (!profile) return null;

  return (
    <Box minH="100vh" bg="bauhaus.background" py={8}>
      <Container maxW="2xl">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Link href="/dashboard">
              <Heading size="md" color="bauhaus.foreground">
                ← Dashboard
              </Heading>
            </Link>
          </HStack>

          <Heading size="lg" color="bauhaus.foreground">
            Generate your identity PFP
          </Heading>
          <Text color="text.secondary">
            Choose traits. Your PFP is deterministic from your Moltbook profile ID.
          </Text>

          <VStack spacing={6}>
            <PFPPreview
              profileId={profile.profileId}
              theme={theme}
              palette={palette}
              symbol={symbol}
            />

            <VStack align="stretch" spacing={4} w="full" maxW="sm">
              <FormControl>
                <FormLabel color="bauhaus.foreground">Theme</FormLabel>
                <Select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  bg="bauhaus.box"
                  borderColor="bauhaus.black"
                  color="bauhaus.foreground"
                >
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="bauhaus.foreground">Color palette</FormLabel>
                <Select
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                  bg="bauhaus.box"
                  borderColor="bauhaus.black"
                  color="bauhaus.foreground"
                >
                  {PALETTES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="bauhaus.foreground">Icon / symbol</FormLabel>
                <Select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  bg="bauhaus.box"
                  borderColor="bauhaus.black"
                  color="bauhaus.foreground"
                >
                  {SYMBOLS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>

            <HStack spacing={4}>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setTheme(THEMES[Math.floor(Math.random() * THEMES.length)]);
                  setPalette(PALETTES[Math.floor(Math.random() * PALETTES.length)]);
                  setSymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
                }}
              >
                Regenerate
              </Button>
              <Button
                as={Link}
                href="/mint"
                variant="primary"
                size="md"
              >
                Continue to Mint
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
