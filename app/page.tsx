"use client";

import { Box } from "@chakra-ui/react";
import {
  Navigation,
  TokenBanner,
  Hero,
  TweetGrid,
  Features,
  TokenSection,
  Footer,
} from "../components";

export default function Home() {
  return (
    <Box as="main" minH="100vh" bg="bauhaus.background">
      <Navigation />
      <TokenBanner />
      <Hero />
      <TweetGrid />
      <Box borderBottom="3px solid" borderColor="bauhaus.foreground" maxW="6xl" mx="auto" />
      <Features />
      <TokenSection />
      <Footer />
    </Box>
  );
}
