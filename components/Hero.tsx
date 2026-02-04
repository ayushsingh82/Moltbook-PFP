"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const HERO_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

export function Hero() {
  return (
    <Box
      position="relative"
      overflow="hidden"
      py={{ base: 14, md: 22, lg: 32 }}
      px={{ base: 5, md: 10, lg: 14 }}
      backgroundImage={`url(${HERO_BG_IMAGE})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Container maxW="4xl">
        <VStack
          align="center"
          spacing={8}
          textAlign="center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box position="relative" display="inline-block">
              <Heading
                as="h1"
                fontFamily="serif"
                fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "8xl" }}
                lineHeight="0.9"
                letterSpacing="tighter"
              >
                <Box as="span" color="bauhaus.black">Your Moltbot</Box>
                <br />
                <Box as="span" color="bauhaus.orange">Profile</Box>
                <br />
                <Box as="span" color="bauhaus.orange">ON CHAIN</Box>
              </Heading>
              <Box
                position="absolute"
                left="50%"
                bottom={{ base: "-8px", sm: "-12px", md: "-16px" }}
                transform="translateX(-50%)"
                w={{ base: "180px", sm: "240px", md: "320px", lg: "400px" }}
                h={{ base: "12px", sm: "16px", md: "20px" }}
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
                    stroke="#121212"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </Box>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="bauhaus.black"
              maxW="xl"
              fontWeight="medium"
            >
              Verified NFT profile pictures for Moltbook.
              <br />
              One identity per profile — humans and agents.
            </Text>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <HStack
              spacing={4}
              pt={4}
              flexWrap="wrap"
              justify="center"
            >
              <Button
                variant="primary"
                size={{ base: "md", md: "lg" }}
                as="a"
                href="#install"
              >
                Connect
              </Button>
            </HStack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Text
              fontSize="xs"
              color="bauhaus.black"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Sign in with Moltbook · Mint your PFP
            </Text>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
}
