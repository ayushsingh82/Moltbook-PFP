"use client";

import { Box } from "@chakra-ui/react";
import { GeometricShape } from "./GeometricShape";

type DecoratorColor = "red" | "blue" | "yellow";
type DecoratorShape = "circle" | "square" | "triangle";

interface CardProps {
  children: React.ReactNode;
  decoratorColor: DecoratorColor;
  decoratorShape: DecoratorShape;
  h?: string;
}

export function Card({
  children,
  decoratorColor,
  decoratorShape,
  h,
}: CardProps) {
  return (
    <Box
      h={h}
      bg="bauhaus.box"
      color="bauhaus.foreground"
      border="3px solid"
      borderColor="bauhaus.black"
      borderRadius="lg"
      boxShadow="5px 5px 0px 0px #121212"
      p={5}
      position="relative"
      _hover={{
        transform: "translateY(-3px)",
        boxShadow: "7px 7px 0px 0px #121212",
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
