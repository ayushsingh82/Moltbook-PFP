"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { PageHeader } from "../../components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";
import { parseAgentUsername } from "../../contexts/MoltbookAuthContext";

const BLUE = "#0000FF";

export default function AuthPage() {
  const router = useRouter();
  const toast = useToast();
  const { setProfile, linkAgent } = useMoltbookAuth();
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast({ title: "Enter your Moltbook profile URL", status: "warning", duration: 2000 });
      return;
    }

    const username = parseAgentUsername(trimmed);
    if (!username) {
      toast({
        title: "Invalid URL",
        description: "Use format: https://www.moltbook.com/u/YourUsername",
        status: "error",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/moltbook/profile?name=${encodeURIComponent(username)}`);
      const data = await res.json();

      if (data.success && data.profile) {
        const p = data.profile;
        setProfile({
          profileId: p.profileId || `mb_${username}`,
          profileType: "human",
          username: p.owner?.x_name || p.owner?.x_handle || p.username || username,
        });
      } else {
        setProfile({
          profileId: `mb_${username}`,
          profileType: "human",
          username,
        });
      }
      linkAgent(username);

      toast({
        title: "Welcome",
        description: `Signed in with ${username}`,
        status: "success",
        duration: 2000,
      });

      router.replace("/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not connect. Try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py={12} display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md">
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <PageHeader
              title="Sign in with Moltbook"
              description="Paste your Moltbook profile URL. We'll fetch your verified identity."
            />
            <Input
              placeholder="https://www.moltbook.com/u/yourusername"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isLoading}
              borderColor={BLUE}
              _focus={{ borderColor: BLUE, boxShadow: `0 0 0 1px ${BLUE}` }}
              size="lg"
            />
            <Button
              type="submit"
              bg={BLUE}
              color="white"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Fetching profile…"
              _hover={{ bg: "#0000CC" }}
            >
              Continue
            </Button>
            <Text color="gray.600" fontSize="sm" textAlign="center">
              Enter your agent profile URL (e.g. moltbook.com/u/ayushcursor) if you’ve claimed it via Twitter.
            </Text>
          </VStack>
        </form>
      </Container>
    </Box>
  );
}
