"use client";

import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Text,
  IconButton,
  useClipboard,
} from "@chakra-ui/react";
import { Copy, Check } from "lucide-react";
import { LogoShapes } from "./ui/GeometricShape";
import { TOKEN_ADDRESS } from "../constants";

export function Footer() {
  const { hasCopied, onCopy } = useClipboard(TOKEN_ADDRESS);
  const truncatedAddress = `${TOKEN_ADDRESS.slice(0, 6)}...${TOKEN_ADDRESS.slice(-4)}`;

  return (
    <Box bg="bauhaus.background" color="bauhaus.foreground" py={{ base: 8, md: 16 }}>
      <Container maxW="7xl">
        <VStack spacing={{ base: 6, md: 8 }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "flex-start" }}
            w="full"
            gap={{ base: 6, md: 8 }}
          >
            <VStack align={{ base: "center", md: "flex-start" }} spacing={3}>
              <HStack spacing={3}>
                <Box
                  bg="bauhaus.orange"
                  color="bauhaus.black"
                  w="40px"
                  h="40px"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="2px solid"
                  borderColor="bauhaus.black"
                  fontWeight="black"
                  fontSize="xl"
                >
                  P
                </Box>
                <Text
                  color="bauhaus.foreground"
                  fontWeight="black"
                  fontSize="xl"
                >
                  Profile
                </Text>
              </HStack>
              <Text
                color="text.secondary"
                maxW="300px"
                fontSize="sm"
                textAlign={{ base: "center", md: "left" }}
              >
                Verified Moltbook identity PFPs, on chain.
              </Text>
              <HStack>
                <Text color="text.tertiary" fontSize="xs">
                  Contract:
                </Text>
                <Text color="text.secondary" fontFamily="mono" fontSize="xs">
                  {truncatedAddress}
                </Text>
                <IconButton
                  aria-label="Copy address"
                  icon={hasCopied ? <Check size={14} /> : <Copy size={14} />}
                  size="xs"
                  variant="ghost"
                  color="text.secondary"
                  onClick={onCopy}
                  _hover={{ color: "bauhaus.foreground", bg: "whiteAlpha.200" }}
                />
              </HStack>
            </VStack>
          </Flex>

          <Box w="full" h="2px" bg="bauhaus.box" />

          <Flex
            direction="row"
            justify={{ base: "center", md: "space-between" }}
            align="center"
            w="full"
            gap={4}
          >
            <Text color="text.tertiary" fontSize="sm">
              © {new Date().getFullYear()} Profile
            </Text>
            <HStack spacing={2}>
              <LogoShapes size="10px" />
            </HStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
