"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Flex,
  useClipboard,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Copy, Check } from "lucide-react";
import { useTokenData } from "../contexts/TokenDataContext";
import { TOKEN_ADDRESS, GECKOTERMINAL_EMBED_URL } from "../constants";

const MotionBox = motion(Box);

const SECTION_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

export function TokenSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { hasCopied, onCopy } = useClipboard(TOKEN_ADDRESS);
  const { tokenData } = useTokenData();

  const truncatedAddress = `${TOKEN_ADDRESS.slice(0, 6)}...${TOKEN_ADDRESS.slice(-4)}`;

  return (
    <Box
      id="token"
      color="bauhaus.foreground"
      py={{ base: 16, md: 24 }}
      position="relative"
      overflow="hidden"
      borderTop="6px solid"
      borderColor="bauhaus.border"
      backgroundImage={`url(${SECTION_BG_IMAGE})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >

      <Container maxW="6xl" ref={ref}>
        <VStack spacing={{ base: 10, md: 14 }}>
          <VStack spacing={4}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Heading
                as="h2"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                color="bauhaus.foreground"
                textAlign="center"
              >
                $NUI
              </Heading>
            </MotionBox>
            <Box w="100px" h="4px" bg="bauhaus.foreground" mx="auto" />
          </VStack>

          <MotionBox
            position="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            w="full"
            maxW="2xl"
            mx="auto"
          >
            <Box
              position="absolute"
              top="-6px"
              right="24px"
              w="14px"
              h="14px"
              bg="bauhaus.foreground"
              transform="rotate(45deg)"
              border="2px solid"
              borderColor="bauhaus.border"
            />
            <HStack
              spacing={0}
              bg="bauhaus.box"
              border="4px solid"
              borderColor="bauhaus.border"
              borderRadius="md"
              boxShadow="5px 5px 0px 0px #121212"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "7px 7px 0px 0px #121212",
              }}
              transition="all 0.2s ease-out"
              cursor="pointer"
              onClick={onCopy}
              role="group"
            >
              <Flex
                bg="bauhaus.yellow"
                color="white"
                px={4}
                py={3}
                align="center"
                borderRight="4px solid"
                borderColor="bauhaus.border"
              >
                <Text
                  color="white"
                  fontSize="sm"
                  fontWeight="black"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  CA
                </Text>
              </Flex>
              <Flex px={4} py={3} align="center" flex={1} color="bauhaus.foreground">
                <Text
                  fontFamily="mono"
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="medium"
                  display={{ base: "none", md: "block" }}
                >
                  {TOKEN_ADDRESS}
                </Text>
                <Text
                  fontFamily="mono"
                  fontSize="sm"
                  fontWeight="medium"
                  display={{ base: "block", md: "none" }}
                >
                  {truncatedAddress}
                </Text>
              </Flex>
              <Flex
                bg={hasCopied ? "bauhaus.red" : "gray.400"}
                minW="50px"
                align="center"
                justify="center"
                alignSelf="stretch"
                borderLeft="4px solid"
                borderColor="bauhaus.border"
                _groupHover={{
                  bg: hasCopied ? "bauhaus.red" : "bauhaus.blue",
                }}
                transition="background 0.2s ease-out"
              >
                {hasCopied ? (
                  <Check size={18} stroke="white" />
                ) : (
                  <Copy size={18} stroke="white" />
                )}
              </Flex>
            </HStack>
            <Box
              position="absolute"
              bottom="-5px"
              left="16px"
              w="10px"
              h="10px"
              bg="bauhaus.yellow"
              borderRadius="full"
              border="2px solid"
              borderColor="bauhaus.border"
            />
          </MotionBox>

          <MotionBox
            w="full"
            maxW="4xl"
            bg="bauhaus.box"
            border="4px solid"
            borderColor="bauhaus.black"
            p={{ base: 4, md: 8 }}
            color="bauhaus.foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              as="iframe"
              id="geckoterminal-embed"
              title="GeckoTerminal Embed"
              src={GECKOTERMINAL_EMBED_URL}
              w="full"
              h={{ base: "350px", md: "500px" }}
              border="none"
              allow="clipboard-write"
              allowFullScreen
            />

            <Flex
              mt={6}
              justify="space-around"
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <VStack>
                <Text color="text.secondary" fontSize="sm" fontWeight="bold">
                  MARKET CAP
                </Text>
                <Text color="bauhaus.foreground" fontSize="2xl" fontWeight="black">
                  {tokenData?.marketCap || "Loading..."}
                </Text>
              </VStack>
              <VStack>
                <Text color="text.secondary" fontSize="sm" fontWeight="bold">
                  1H CHANGE
                </Text>
                <Text
                  color={
                    tokenData?.change1h !== undefined && tokenData.change1h >= 0
                      ? "green.400"
                      : "red.400"
                  }
                  fontSize="2xl"
                  fontWeight="black"
                >
                  {tokenData?.change1h !== undefined
                    ? `${tokenData.change1h >= 0 ? "+" : ""}${tokenData.change1h.toFixed(2)}%`
                    : "..."}
                </Text>
              </VStack>
              <VStack>
                <Text color="text.secondary" fontSize="sm" fontWeight="bold">
                  PRICE
                </Text>
                <Text color="bauhaus.foreground" fontSize="2xl" fontWeight="black">
                  {tokenData?.price || "..."}
                </Text>
              </VStack>
            </Flex>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
