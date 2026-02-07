"use client";

import { Box } from "@chakra-ui/react";
import {
  TokenBanner,
  Hero,
  // TweetGrid,  // What people are saying — commented out for now
  Features,
  // TokenSection,  // Token section — commented out for now
  Footer,
} from "../components";

export default function Home() {
  const thinLine = <Box w="full" h="1px" bg="black" aria-hidden />;
  return (
    <Box as="main" bg="#0000FF" color="white" minH="100vh">
      <TokenBanner />
      <Hero />
      {thinLine}
      {/* {thinLine}
      <TweetGrid />
      {thinLine} */}
      <Features />
      {thinLine}
      {/* <TokenSection />
      {thinLine} */}
      <Footer />
    </Box>
  );
}
