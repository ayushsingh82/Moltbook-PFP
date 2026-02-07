"use client";

import { Box, HStack, Text } from "@chakra-ui/react";

const BLUE_BG = "#0000FF";

export function TokenBanner() {
  return (
    <Box position="sticky" top={0} zIndex={100}>
      <HStack
        bg={BLUE_BG}
        color="white"
        py={3}
        px={{ base: 4, md: 8 }}
        justify="center"
        spacing={{ base: 3, md: 6 }}
        borderBottom="3px solid"
        borderColor="white"
        flexWrap="wrap"
        rowGap={3}
      >
        <HStack spacing={2}>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="white"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Token
          </Text>
          <Box
            bg="white"
            color={BLUE_BG}
            px={3}
            py={1.5}
            fontWeight="900"
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="wide"
            border="2px solid"
            borderColor="white"
            boxShadow="3px 3px 0px 0px rgba(0,0,0,0.2)"
          >
            $MPFP
          </Box>
        </HStack>

        <Box
          bg="black"
          color="white"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="wider"
          border="2px solid"
          borderColor="white"
        >
          Not live yet
        </Box>
      </HStack>
    </Box>
  );
}
