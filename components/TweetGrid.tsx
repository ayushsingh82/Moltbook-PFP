"use client";

import { Box, Container, Heading, VStack, SimpleGrid } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { TweetCard } from "./ui/TweetCard";
import { tweets, getTweetId } from "../data/tweets";

const MotionBox = motion(Box);

const DECORATOR_COLORS = ["blue", "red", "yellow"] as const;
const DECORATOR_SHAPES = ["circle", "square", "triangle"] as const;

export function TweetGrid() {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });

  return (
    <Box
      id="tweets"
      bg="bauhaus.background"
      pt={{ base: 18, md: 28 }}
      pb={{ base: 14, md: 20 }}
    >
      <Container maxW="6xl">
        <VStack spacing={{ base: 14, md: 20 }}>
          <VStack spacing={5} ref={headingRef} w="full" align="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Box position="relative" display="inline-block">
                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  textAlign="center"
                  color="bauhaus.foreground"
                >
                  WHAT PEOPLE ARE SAYING
                </Heading>
                <Box
                  position="absolute"
                  left="50%"
                  bottom={{ base: "-10px", md: "-12px" }}
                  transform="translateX(-50%)"
                  w={{ base: "200px", md: "280px", lg: "340px" }}
                  h={{ base: "10px", md: "14px" }}
                  overflow="visible"
                >
                  <svg
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                    style={{ width: "100%", height: "100%", overflow: "visible" }}
                  >
                    <path
                      d="M 0 18 Q 100 0 200 18"
                      fill="none"
                      stroke="#F1F1F1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>
              </Box>
            </MotionBox>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 6, md: 8 }}
            w="full"
          >
            {tweets.map((tweetUrl, index) => (
              <Box key={getTweetId(tweetUrl)}>
                <TweetCard
                  tweetId={getTweetId(tweetUrl)}
                  decoratorColor={
                    DECORATOR_COLORS[index % DECORATOR_COLORS.length]
                  }
                  decoratorShape={
                    DECORATOR_SHAPES[index % DECORATOR_SHAPES.length]
                  }
                  delay={0.1 * (index + 1)}
                />
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
