"use client";

import { Box, HStack, Text } from "@chakra-ui/react";
import { useTokenData } from "../contexts/TokenDataContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionText = motion(Text);
const MotionBox = motion(Box);

function LoadingShapes() {
  return (
    <HStack spacing={1}>
      <MotionBox
        w="6px"
        h="6px"
        borderRadius="full"
        bg="bauhaus.red"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <MotionBox
        w="6px"
        h="6px"
        bg="bauhaus.blue"
        transform="rotate(45deg)"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />
      <MotionBox
        w={0}
        h={0}
        borderLeft="4px solid transparent"
        borderRight="4px solid transparent"
        borderBottom="7px solid"
        borderBottomColor="bauhaus.yellow"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      />
    </HStack>
  );
}

export function TokenBanner() {
  const { tokenData, isLoading } = useTokenData();
  const [displayValue, setDisplayValue] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const prevDisplayRef = useRef<string | null>(null);
  const prevRawRef = useRef<number | null>(null);

  useEffect(() => {
    if (tokenData?.marketCap !== undefined) {
      const newDisplay = tokenData.marketCap;
      const newRaw = tokenData.marketCapRaw;
      const prevDisplay = prevDisplayRef.current;
      const prevRaw = prevRawRef.current;

      if (
        prevDisplay !== null &&
        prevDisplay !== newDisplay &&
        prevRaw !== null
      ) {
        setDirection(newRaw! > prevRaw ? "up" : "down");
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 600);
        prevDisplayRef.current = newDisplay;
        prevRawRef.current = newRaw ?? null;
        setDisplayValue(newDisplay);
        return () => clearTimeout(timer);
      }

      prevDisplayRef.current = newDisplay;
      prevRawRef.current = newRaw ?? null;
      setDisplayValue(newDisplay);
    }
  }, [tokenData?.marketCap, tokenData?.marketCapRaw]);

  const BLUE_BG = "#0000FF";

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
            Powered by
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
            $A2B
          </Box>
        </HStack>

        <HStack
          spacing={1}
          bg="white"
          color={BLUE_BG}
          border="2px solid"
          borderColor={isAnimating ? "bauhaus.green" : "white"}
          boxShadow={
            isAnimating
              ? "3px 3px 0px 0px #208040"
              : "3px 3px 0px 0px rgba(0,0,0,0.2)"
          }
          px={4}
          py={1.5}
          transition="all 0.2s ease-out"
        >
          <Text
            fontSize="xs"
            fontWeight="700"
            color={BLUE_BG}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            MCap:
          </Text>
          {isLoading || !displayValue ? (
            <LoadingShapes />
          ) : (
            <Box
              position="relative"
              overflow="hidden"
              h="18px"
              minW="70px"
              display="flex"
              alignItems="center"
            >
              <AnimatePresence mode="popLayout">
                <MotionText
                  key={displayValue}
                  fontSize="sm"
                  fontWeight="black"
                  color={isAnimating ? "bauhaus.green" : BLUE_BG}
                  position="absolute"
                  whiteSpace="nowrap"
                  initial={{
                    y: direction === "up" ? 16 : -16,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: direction === "up" ? -16 : 16,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  {displayValue}
                </MotionText>
              </AnimatePresence>
            </Box>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}
