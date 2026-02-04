"use client";

import { Box, Container, Text, Spinner, Button, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";
import Link from "next/link";

type AuthState = "loading" | "success" | "error";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setProfile } = useMoltbookAuth();
  const [state, setState] = useState<AuthState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Simulate Moltbook auth verification. In production, validate token/code from query.
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setState("error");
      setErrorMessage("Authentication failed");
      return;
    }

    const timer = setTimeout(() => {
      // Mock: treat as success and create a profile. Replace with real Moltbook API call.
      const profileId = code || `mb_${Date.now().toString(36)}`;
      setProfile({
        profileId,
        profileType: "human",
        username: `user_${profileId.slice(-6)}`,
      });
      setState("success");
      router.replace("/dashboard");
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, setProfile, router]);

  if (state === "error") {
    return (
      <Box minH="100vh" bg="bauhaus.background" py={20}>
        <Container maxW="md">
          <VStack spacing={6}>
            <Text color="bauhaus.foreground" fontSize="xl" fontWeight="bold">
              Authentication failed
            </Text>
            <Text color="text.secondary">{errorMessage}</Text>
            <Button as={Link} href="/" variant="primary" size="md">
              Back to home
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="bauhaus.background" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md">
        <VStack spacing={6}>
          <Spinner size="xl" color="bauhaus.orange" thickness="3px" />
          <Text color="bauhaus.foreground" fontSize="lg">
            Verifying Moltbook profile…
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
