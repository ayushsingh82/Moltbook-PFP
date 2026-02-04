"use client";

import { Box, Container, Text, Spinner, VStack } from "@chakra-ui/react";
import { PageHeader } from "../../components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMoltbookAuth } from "../../contexts/MoltbookAuthContext";

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
      // Delay navigation so context/localStorage is updated before dashboard reads it
      setTimeout(() => router.replace("/dashboard"), 50);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, setProfile, router]);

  if (state === "error") {
    return (
      <Box minH="100vh" py={8}>
        <Container maxW="md">
          <VStack spacing={6} align="stretch">
            <PageHeader
              title="Authentication failed"
              description={errorMessage}
            />
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md">
        <VStack spacing={6}>
          <Spinner size="xl" color="bauhaus.orange" thickness="3px" />
          <Text color="bauhaus.black" fontSize="lg">
            Verifying Moltbook profile…
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
