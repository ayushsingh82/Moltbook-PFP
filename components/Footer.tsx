"use client";

import {
  Box,
  Container,
  Flex,
  HStack,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";

const BLUE = "#0000FF";

export function Footer() {
  return (
    <Box fontFamily="serif" bg={BLUE} color="white" py={{ base: 8, md: 16 }}>
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
                  bg="black"
                  border="2px solid"
                  borderColor="black"
                  h="40px"
                  minW="40px"
                  p={0}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src="/images/logo.png" alt="Moltbook-PFP" h="full" w="auto" objectFit="contain" />
                </Box>
                <Text color="white" fontWeight="black" fontSize="xl">
                  Moltbook-PFP
                </Text>
              </HStack>
              <Text
                color="whiteAlpha.900"
                maxW="300px"
                fontSize="sm"
                textAlign={{ base: "center", md: "left" }}
              >
                Verified Moltbook identity PFPs, on chain.
              </Text>
              <HStack>
                <Text color="whiteAlpha.800" fontSize="xs">
                  Contract:
                </Text>
                <Text color="whiteAlpha.900" fontSize="xs" fontStyle="italic">
                  Coming soon
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <Box w="full" h="2px" bg="whiteAlpha.300" />

          <Flex
            direction="row"
            justify={{ base: "center", md: "space-between" }}
            align="center"
            w="full"
            gap={4}
          >
            <Text color="whiteAlpha.800" fontSize="sm">
              © {new Date().getFullYear()} Moltbook-PFP
            </Text>
            <HStack spacing={1}>
              <Box w="10px" h="10px" borderRadius="full" bg="white" />
              <Box w="10px" h="10px" bg="white" transform="rotate(45deg)" />
            </HStack>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
