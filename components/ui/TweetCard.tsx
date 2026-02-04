"use client";

import { Box } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GeometricShape } from "./GeometricShape";

type DecoratorColor = "red" | "blue" | "yellow";
type DecoratorShape = "circle" | "square" | "triangle";

const BLUE = "#0000FF";
// Chakra default blue.200
const BLUE_200 = "#90CDF4";

interface TweetCardProps {
  tweetId: string;
  decoratorColor: DecoratorColor;
  decoratorShape: DecoratorShape;
  delay?: number;
  useBlueBg?: boolean;
}

const MotionBox = motion(Box);

export function TweetCard({
  tweetId,
  decoratorColor,
  decoratorShape,
  delay = 0,
  useBlueBg = false,
}: TweetCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <Box
        display="block"
        bg={useBlueBg ? BLUE : "bauhaus.box"}
        color={useBlueBg ? "white" : "bauhaus.foreground"}
        border="3px solid"
        borderColor={useBlueBg ? "white" : "bauhaus.black"}
        borderRadius="lg"
        boxShadow={`5px 5px 0px 0px ${BLUE_200}`}
        p={5}
        position="relative"
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: `7px 7px 0px 0px ${BLUE_200}`,
        }}
        transition="all 0.2s ease-out"
      >
        <Box position="absolute" bottom={4} right={4}>
          <GeometricShape
            shape={decoratorShape}
            color={decoratorColor}
            size="12px"
          />
        </Box>
        <Box
          as="blockquote"
          className="twitter-tweet"
          data-dnt="true"
          sx={{
            "& iframe": { maxWidth: "100% !important" },
          }}
        >
          <iframe
            title={`Tweet ${tweetId}`}
            src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark`}
            width="100%"
            height="200"
            frameBorder="0"
            style={{ minHeight: "200px" }}
          />
        </Box>
      </Box>
    </MotionBox>
  );
}
