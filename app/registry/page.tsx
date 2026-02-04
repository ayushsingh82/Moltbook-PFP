"use client";

import {
  Box,
  Container,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { PageHeader } from "../../components";
import { ExternalLink } from "lucide-react";

const BLUE = "#0000FF";
const SHADOW_LIGHT_BLUE = "#ADD8E6";
const PAGE_BG_IMAGE =
  "https://img.freepik.com/premium-photo/sky-with-beautiful-cloud-background_570543-6327.jpg?semt=ais_hybrid&w=740&q=80";

// Mock registry data. In production, fetch from API or chain.
const MOCK_REGISTRY = [
  { profileId: "mb_abc123", mintAddress: "0x1234567890abcdef1234567890abcdef12345678", profileType: "human" },
  { profileId: "mb_def456", mintAddress: "0xabcdef1234567890abcdef1234567890abcdef", profileType: "agent" },
  { profileId: "mb_ghi789", mintAddress: "0x9876543210fedcba9876543210fedcba98765432", profileType: "human" },
  { profileId: "mb_jkl012", mintAddress: "0x1111222233334444555566667777888899990000", profileType: "agent" },
  { profileId: "mb_mno345", mintAddress: "0xaaaabbbbccccddddeeeeffff0000111122223333", profileType: "human" },
];

function truncateAddress(addr: string, start = 6, end = 4) {
  if (addr.length <= start + end) return addr;
  return `${addr.slice(0, start)}…${addr.slice(-end)}`;
}

export default function RegistryPage() {
  return (
    <Box
      minH="100vh"
      py={8}
      color="black"
      backgroundImage={`url(${PAGE_BG_IMAGE})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Container maxW="5xl">
        <VStack spacing={8} align="stretch">
          <PageHeader
            variant="blue"
            title="Registry"
            description="Moltbook profile IDs mapped to NFT mint addresses. Read-only. For transparency and debugging."
          />

          <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <Text color={BLUE} fontSize="sm" fontWeight="bold">
              {MOCK_REGISTRY.length} profile{MOCK_REGISTRY.length !== 1 ? "s" : ""} registered
            </Text>
          </HStack>

          <TableContainer
            bg="white"
            border="3px solid"
            borderColor={BLUE}
            borderRadius="xl"
            overflowX="auto"
            boxShadow={`6px 6px 0px 0px ${SHADOW_LIGHT_BLUE}`}
          >
            <Table size="md" variant="unstyled">
              <Thead>
                <Tr
                  bg={BLUE}
                  borderBottom="3px solid"
                  borderColor={BLUE}
                >
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                  >
                    Moltbook Profile ID
                  </Th>
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                  >
                    NFT Mint Address
                  </Th>
                  <Th
                    color="white"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    fontSize="xs"
                    py={4}
                    px={5}
                    isNumeric
                  >
                    Profile Type
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {MOCK_REGISTRY.map((row) => (
                  <Tr
                    key={row.profileId}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    _last={{ borderBottom: "none" }}
                    _hover={{ bg: "gray.50" }}
                    transition="background 0.15s"
                  >
                    <Td
                      color="black"
                      fontFamily="mono"
                      fontSize="sm"
                      fontWeight="medium"
                      py={4}
                      px={5}
                    >
                      <ChakraLink
                        as={Link}
                        href={`/profile/${row.profileId}`}
                        color={BLUE}
                        _hover={{ textDecoration: "underline" }}
                      >
                        {row.profileId}
                      </ChakraLink>
                    </Td>
                    <Td
                      color="black"
                      fontFamily="mono"
                      fontSize="xs"
                      py={4}
                      px={5}
                      title={row.mintAddress}
                    >
                      <HStack spacing={2} display="inline-flex" align="center">
                        <span>{truncateAddress(row.mintAddress, 10, 8)}</span>
                        <ChakraLink
                          as={Link}
                          href={`/profile/${row.profileId}`}
                          aria-label={`View ${row.profileId}`}
                          color={BLUE}
                          _hover={{ color: BLUE, opacity: 0.8 }}
                          display="inline-flex"
                        >
                          <ExternalLink size={14} />
                        </ChakraLink>
                      </HStack>
                    </Td>
                    <Td py={4} px={5} isNumeric>
                      <Badge
                        bg={BLUE}
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        {row.profileType}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Container>
    </Box>
  );
}
