"use client";

import { Box } from "@chakra-ui/react";
import { GeometricShape } from "./GeometricShape";

type DecoratorColor = "red" | "blue" | "yellow";
type DecoratorShape = "circle" | "square" | "triangle";

const BLUE = "#0000FF";
// Chakra default blue.200
const BLUE_200 = "#90CDF4";

interface CardProps {
  children: React.ReactNode;
  decoratorColor: DecoratorColor;
  decoratorShape: DecoratorShape;
  h?: string;
  variant?: "default" | "blue";
}

export function Card({
  children,
  decoratorColor,
  decoratorShape,
  h,
  variant = "default",
}: CardProps) {
  const isBlue = variant === "blue";
  return (
    <Box
      h={h}
      bg={isBlue ? BLUE : "bauhaus.box"}
      color={isBlue ? "white" : "bauhaus.foreground"}
      border="3px solid"
      borderColor={isBlue ? "white" : "bauhaus.black"}
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
      {children}
      <Box position="absolute" bottom={4} right={4}>
        <GeometricShape
          shape={decoratorShape}
          color={decoratorColor}
          size="12px"
        />
      </Box>
    </Box>
  );
}
