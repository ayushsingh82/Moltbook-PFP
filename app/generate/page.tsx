"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  Button,
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
import { Bot, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";
import { HexColorPicker } from "react-colorful";
import { useAccount, useWriteContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MOLTBOOK_IDENTITY_NFT_ABI, getNftContractAddress } from "../../lib/nft-contract";

const BLUE = "#0000FF";
const BLUE_200 = "#90CDF4";
const PAGE_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

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
      borderColor={isSelected ? BLUE : "gray.300"}
      bg="white"
      overflow="hidden"
      boxShadow={`4px 4px 0 0 ${BLUE_200}`}
      _hover={{ borderColor: BLUE }}
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
  agentSrc,
  size = "260px",
  innerBoxBg,
  innerBoxBorder,
}: {
  agentSrc: string;
  size?: string;
  innerBoxBg?: string;
  innerBoxBorder?: string;
}) {
  const resolvedSize = useBreakpointValue(
    size === "260px" ? { base: "180px", sm: "220px", md: "260px", lg: "280px" } : { base: "120px", md: "160px" }
  ) ?? (size === "260px" ? "260px" : "160px");
  const innerBg = innerBoxBg ?? "#171717";
  const innerBorder = innerBoxBorder ?? "#ffffff";

  return (
    <Box
      w={resolvedSize}
      h={resolvedSize}
      flexShrink={0}
      borderRadius="2xl"
      border="4px solid"
      borderColor={innerBorder}
      overflow="hidden"
      bg={innerBg}
    >
      <Image
        src={agentSrc}
        fallbackSrc="/images/placeholder.svg"
        alt="PFP"
        w="full"
        h="full"
        objectFit="contain"
      />
    </Box>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const toast = useToast();
  const { profile, isLoading } = useMoltbookAuth();
  const { address: walletAddress, isConnected } = useAccount();
  const { writeContractAsync, isPending: isContractPending } = useWriteContract();
  const [innerBoxBg, setInnerBoxBg] = useState("#171717");
  const [innerBoxBorder, setInnerBoxBorder] = useState("#ffffff");
  const [selectedAgent, setSelectedAgent] = useState<(typeof AGENT_IMAGES)[number]>(AGENT_IMAGES[0]);
  const [mintState, setMintState] = useState<MintState>("idle");
  const [mintTxHash, setMintTxHash] = useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);
  const contractAddress = getNftContractAddress();

  useEffect(() => {
    if (!isLoading && !profile) router.replace("/auth");
  }, [profile, isLoading, router]);

  const isStacked = useBreakpointValue({ base: true, lg: false });

  if (isLoading) return null;
  if (!profile) return null;

  // Agents: coming soon
  if (profile.profileType === "agent") {
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
        <Container maxW="lg">
          <PageHeader
            variant="blue"
            title="Coming soon"
            description="Agent PFP generation and minting will be available soon."
          />
          <Box
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="xl"
            p={8}
            mt={6}
            boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
          >
            <VStack spacing={4}>
              <Bot size={48} color={BLUE} />
              <Text color="gray.600" textAlign="center">
                Agent profile pictures and registry support are in the works. Check back soon!
              </Text>
              <Button as={Link} href="/dashboard" variant="outline" borderColor={BLUE} color={BLUE}>
                Back to dashboard
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

  const handleRandomize = () => {
    setSelectedAgent(AGENT_IMAGES[Math.floor(Math.random() * AGENT_IMAGES.length)]);
  };

  const handleDownload = () => {
    if (!previewRef.current) return;
    toPng(previewRef.current, { pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "moltbook-pfp.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        toast({ title: "Download failed", status: "error", duration: 3000 });
      });
  };

  const handleMint = async () => {
    if (!profile) return;
    if (!isConnected || !walletAddress) {
      toast({ title: "Connect your wallet first", status: "warning", duration: 3000 });
      return;
    }
    if (!contractAddress) {
      toast({ title: "Contract not configured", description: "Set NEXT_PUBLIC_NFT_CONTRACT_ADDRESS", status: "error", duration: 5000 });
      return;
    }
    if (!previewRef.current) {
      toast({ title: "Preview not ready", status: "warning", duration: 2000 });
      return;
    }

    setMintState("loading");
    try {
      // 1) Capture final PFP as PNG (pixelRatio 1.5 keeps size reasonable for IPFS)
      const dataUrl = await toPng(previewRef.current, { pixelRatio: 1.5 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "pfp.png", { type: "image/png" });

      // 2) Upload image to IPFS
      const formData = new FormData();
      formData.append("file", file);
      const pinFileRes = await fetch("/api/ipfs/pin-file", { method: "POST", body: formData });
      if (!pinFileRes.ok) {
        const err = await pinFileRes.json().catch(() => ({}));
        const raw = err?.error;
        const msg = typeof raw === "string" ? raw : (raw && typeof raw === "object" && "message" in raw ? String((raw as { message: unknown }).message) : null) ?? "Image upload failed (check PINATA_JWT in .env)";
        throw new Error(msg);
      }
      const { uri: imageUri } = await pinFileRes.json();

      // 3) Build metadata and upload to IPFS
      const metadata = {
        name: profile.displayName ?? profile.username ?? "Moltbook Identity",
        description: "Verified Moltbook profile PFP",
        image: imageUri,
        moltbook_profile_id: profile.profileId,
        profile_type: profile.profileType,
      };
      const pinJsonRes = await fetch("/api/ipfs/pin-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });
      if (!pinJsonRes.ok) {
        const err = await pinJsonRes.json().catch(() => ({}));
        const msg = typeof err?.error === "string" ? err.error : err?.error?.message ?? (err?.error ? String(err.error) : "Metadata upload failed");
        throw new Error(msg);
      }
      const { uri: metadataUri } = await pinJsonRes.json();

      // 4) Mint on contract (to = connected wallet, uri = metadata CID)
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: MOLTBOOK_IDENTITY_NFT_ABI,
        functionName: "mint",
        args: [walletAddress, metadataUri, profile.profileId, profile.profileType],
      });
      setMintTxHash(hash);
      setMintState("success");
      toast({
        title: "NFT minted",
        description: "Your identity PFP is on chain.",
        status: "success",
        duration: 5000,
      });
    } catch (e) {
      setMintState("error");
      let msg = "Mint failed. Try again.";
      if (e instanceof Error) {
        msg = e.message;
      } else if (e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string") {
        msg = (e as { message: string }).message;
      } else if (e && typeof e === "object") {
        msg = JSON.stringify(e).slice(0, 200) || msg;
      }
      toast({ title: "Mint failed", description: msg, status: "error", duration: 6000 });
    }
  };

  if (mintState === "success") {
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
        <Container maxW="lg">
          <PageHeader
            variant="blue"
            title="Minted successfully"
            description="Your identity PFP is now on chain. View your profile below."
          />
          <Box
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="xl"
            overflow="hidden"
            boxShadow={`6px 6px 0px 0px ${BLUE_200}`}
            mt={6}
          >
            <VStack spacing={6} p={8}>
              <PFPPreview
                agentSrc={selectedAgent.src}
                size="160px"
                innerBoxBg={innerBoxBg}
                innerBoxBorder={innerBoxBorder}
              />
              <Text color="black" fontWeight="bold">
                Your identity NFT is on chain
              </Text>
              {mintTxHash && (
                <Box
                  w="full"
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={BLUE}
                >
                  <Text color="gray.600" fontSize="xs" mb={1}>Transaction</Text>
                  <Text color="black" fontSize="xs" fontFamily="mono" wordBreak="break-all">
                    {mintTxHash}
                  </Text>
                  <Button
                    as="a"
                    href={`https://sepolia.basescan.org/tx/${mintTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="sm"
                    mt={2}
                    variant="outline"
                    borderColor={BLUE}
                    color={BLUE}
                  >
                    View on BaseScan
                  </Button>
                </Box>
              )}
              <Button as={Link} href={`/profile/${profile.profileId}`} bg={BLUE} color="white" size="lg" w="full" _hover={{ bg: "#0000CC" }}>
                View profile
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    );
  }

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
            py={4}
          >
            <Text color="white" fontWeight="bold" fontSize="lg" textTransform="uppercase" letterSpacing="wider">
              Generate & mint your identity PFP
            </Text>
          </Box>

          <Box
            bg={BLUE}
            borderBottom="3px solid"
            borderColor={BLUE}
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
              borderColor={BLUE}
            >
              <VStack align="stretch" spacing={5}>
                <FormControl>
                  <FormLabel color="black" fontSize="sm" fontWeight="bold">Inner box color (behind agent)</FormLabel>
                  <Box p={2} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <HexColorPicker color={innerBoxBg} onChange={setInnerBoxBg} style={{ width: "100%", height: "100px" }} />
                    <Text fontFamily="mono" fontSize="xs" color="gray.600" mt={1}>{innerBoxBg}</Text>
                  </Box>
                </FormControl>
                <FormControl>
                  <FormLabel color="black" fontSize="sm" fontWeight="bold">Border color (inner frame)</FormLabel>
                  <Box p={2} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <HexColorPicker color={innerBoxBorder} onChange={setInnerBoxBorder} style={{ width: "100%", height: "100px" }} />
                    <Text fontFamily="mono" fontSize="xs" color="gray.600" mt={1}>{innerBoxBorder}</Text>
                  </Box>
                </FormControl>
                <Box>
                  <FormLabel color="black" fontSize="sm" fontWeight="bold" mb={2}>Agent image</FormLabel>
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
                  color={BLUE}
                  borderColor={BLUE}
                  _hover={{ bg: "blue.50", color: BLUE }}
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
              bg="gray.50"
              minH={{ base: "320px", lg: "auto" }}
            >
              <VStack spacing={4}>
                <Box ref={previewRef} display="inline-block">
                  <PFPPreview
                    agentSrc={selectedAgent.src}
                    innerBoxBg={innerBoxBg}
                    innerBoxBorder={innerBoxBorder}
                  />
                </Box>
                <Button
                  size="md"
                  variant="outline"
                  leftIcon={<Download size={18} />}
                  onClick={handleDownload}
                  color={BLUE}
                  borderColor={BLUE}
                  _hover={{ bg: "blue.50" }}
                >
                  Download
                </Button>
              </VStack>
            </Box>
          </Flex>

          <Box bg={BLUE} borderBottom="3px solid" borderColor={BLUE} px={5} py={3} textAlign="center">
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
              borderColor={BLUE}
            >
              <Box flexShrink={0}>
                <Text color={BLUE} fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                  Final PFP
                </Text>
                <PFPPreview
                  agentSrc={selectedAgent.src}
                  size="160px"
                  innerBoxBg={innerBoxBg}
                  innerBoxBorder={innerBoxBorder}
                />
              </Box>
              <Box flex={1} minW={0}>
                <Text color={BLUE} fontSize="xs" fontWeight="bold" textTransform="uppercase" mb={2}>
                  Metadata (on-chain)
                </Text>
                <Box
                  as="pre"
                  fontSize="xs"
                  fontFamily="mono"
                  color="black"
                  whiteSpace="pre-wrap"
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={BLUE}
                >
                  {JSON.stringify(
                    {
                      name: profile.displayName ?? profile.username ?? "Moltbook Identity",
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
              {!isConnected ? (
                <VStack spacing={3}>
                  <Text color="gray.600" fontSize="sm">Connect your wallet to mint.</Text>
                  <ConnectButton />
                </VStack>
              ) : !contractAddress ? (
                <Text color="orange.600" fontSize="sm">NEXT_PUBLIC_NFT_CONTRACT_ADDRESS is not set. Deploy the contract on Base Sepolia and add the address to .env</Text>
              ) : (
                <Button
                  bg={BLUE}
                  color="white"
                  size="lg"
                  w="full"
                  onClick={handleMint}
                  isLoading={mintState === "loading" || isContractPending}
                  loadingText="Uploading & minting…"
                  leftIcon={mintState === "loading" || isContractPending ? <Spinner size="sm" /> : undefined}
                  _hover={{ bg: "#0000CC" }}
                >
                  Mint NFT
                </Button>
              )}
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}
