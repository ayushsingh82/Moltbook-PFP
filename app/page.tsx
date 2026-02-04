"use client";

import { Box } from "@chakra-ui/react";
import {
  TokenBanner,
  Hero,
  TweetGrid,
  Features,
  TokenSection,
  Footer,
} from "../components";

export default function Home() {
  return (
    <Box as="main">
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
