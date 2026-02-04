"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <VStack align="flex-start" spacing={3} w="full">
      <Box position="relative" display="inline-block">
        <Heading size="lg" color="bauhaus.black">
          {title}
        </Heading>
        <Box
          position="absolute"
          left={0}
          bottom="-8px"
          w="120px"
          h="10px"
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
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </Box>
      </Box>
      <Text color="bauhaus.black" fontSize="sm" maxW="xl">
        {description}
      </Text>
    </VStack>
  );
}
