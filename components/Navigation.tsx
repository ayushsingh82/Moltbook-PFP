"use client";

import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Token", href: "#token" },
];

export function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      bg="bauhaus.box"
      borderBottom="4px solid"
      borderColor="bauhaus.black"
    >
      <Container maxW="7xl" py={4}>
        <Flex justify="space-between" align="center">
          <Link href="/" _hover={{ textDecoration: "none" }} color="bauhaus.foreground">
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
              <Box
                fontWeight="black"
                fontSize="xl"
                textTransform="uppercase"
                letterSpacing="tight"
                color="bauhaus.foreground"
              >
                PROFILE
              </Box>
            </HStack>
          </Link>

          <HStack spacing={8} display={{ base: "none", md: "flex" }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wider"
                fontSize="sm"
                color="bauhaus.foreground"
                _hover={{ color: "bauhaus.foreground", opacity: 0.7 }}
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          <HStack spacing={4}>
            <Button
              variant="primary"
              size="md"
              as="a"
              href="#install"
              display={{ base: "none", md: "flex" }}
            >
              Connect Wallet
            </Button>
            <IconButton
              aria-label="Open menu"
              icon={<Menu size={24} />}
              variant="ghost"
              display={{ base: "flex", md: "none" }}
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Container>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent bg="bauhaus.box">
          <DrawerCloseButton color="bauhaus.foreground" size="lg" />
          <DrawerHeader>
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
              <Box
                color="bauhaus.foreground"
                fontWeight="black"
                textTransform="uppercase"
              >
                PROFILE
              </Box>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={8} align="flex-start" mt={8}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="bauhaus.foreground"
                  fontWeight="bold"
                  fontSize="2xl"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  onClick={onClose}
                  _hover={{ color: "bauhaus.foreground", opacity: 0.7 }}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                variant="primary"
                size="lg"
                as="a"
                href="#install"
                mt={4}
                onClick={onClose}
              >
                Connect Wallet
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
