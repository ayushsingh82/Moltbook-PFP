"use client";

import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  Image,
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

const BLUE = "#0000FF";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Generate", href: "/generate" },
  { label: "Registry", href: "/registry" },
];

export function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      fontFamily="serif"
      bg="white"
      borderBottom="1px solid"
      borderColor="black"
    >
      <Container maxW="7xl" py={4}>
        <Flex justify="space-between" align="center">
          <Link href="/" _hover={{ textDecoration: "none" }} color="black">
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
                <Image src="/images/logo.png" alt="A2Base" h="full" w="auto" objectFit="contain" />
              </Box>
              <Box fontWeight="black" fontSize="xl" color="black">
                A2Base
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
                color="black"
                _hover={{ color: "black", opacity: 0.7 }}
              >
                {link.label}
              </Link>
            ))}
          </HStack>

          <HStack spacing={4}>
            <Button
              bg={BLUE}
              color="white"
              size="md"
              as="a"
              href="/auth"
              display={{ base: "none", md: "flex" }}
              _hover={{ bg: "#0000CC", color: "white" }}
            >
              Connect
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
        <DrawerContent bg="white">
          <DrawerCloseButton color="black" size="lg" />
          <DrawerHeader>
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
                <Image src="/images/logo.png" alt="A2Base" h="full" w="auto" objectFit="contain" />
              </Box>
              <Box color="black" fontWeight="black">
                A2Base
              </Box>
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={8} align="flex-start" mt={8}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="black"
                  fontWeight="bold"
                  fontSize="2xl"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  onClick={onClose}
                  _hover={{ color: "black", opacity: 0.7 }}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                bg={BLUE}
                color="white"
                size="lg"
                as="a"
                href="/auth"
                mt={4}
                onClick={onClose}
                _hover={{ bg: "#0000CC", color: "white" }}
              >
                Connect
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
