"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";
import { TokenDataProvider } from "../contexts/TokenDataContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <TokenDataProvider>{children}</TokenDataProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
