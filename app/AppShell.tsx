"use client";

import { Box } from "@chakra-ui/react";
import { Navigation } from "../components";

const BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="main"
      minH="100vh"
      backgroundImage={`url(${BG_IMAGE})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Navigation />
      {children}
    </Box>
  );
}
