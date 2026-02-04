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
  const thinLine = <Box w="full" h="1px" bg="black" aria-hidden />;
  return (
    <Box as="main" bg="#0000FF" color="white" minH="100vh">
      <TokenBanner />
      <Hero />
      {thinLine}
      <TweetGrid />
      {thinLine}
      <Features />
      {thinLine}
      <TokenSection />
      {thinLine}
      <Footer />
    </Box>
  );
}
