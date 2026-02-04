"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  UserCircle,
  Users,
  Palette,
  Link2,
  BadgeCheck,
} from "lucide-react";
import { Card } from "./ui/Card";

const MotionBox = motion(Box);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  decoratorColor: "red" | "blue" | "yellow";
  decoratorShape: "circle" | "square" | "triangle";
  delay?: number;
}

function FeatureCard({
  icon,
  title,
  description,
  decoratorColor,
  decoratorShape,
  delay = 0,
}: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      h="full"
    >
      <Card
        decoratorColor={decoratorColor}
        decoratorShape={decoratorShape}
        h="full"
      >
        <VStack align="flex-start" spacing={4} h="full">
          <Box
            p={3}
            border="3px solid"
            borderColor="bauhaus.black"
            bg="bauhaus.smallBox"
            color="bauhaus.smallBoxText"
          >
            {icon}
          </Box>
          <Heading as="h3" size="md" fontWeight="normal" color="bauhaus.foreground">
            {title}
          </Heading>
          <Text color="text.secondary" fontWeight="medium">
            {description}
          </Text>
        </VStack>
      </Card>
    </MotionBox>
  );
}

const features = [
  {
    icon: <Shield size={28} />,
    title: "Sign in with Moltbook",
    description: "Verify your identity with Moltbook. Only real profiles can mint a PFP NFT.",
    decoratorColor: "red" as const,
    decoratorShape: "circle" as const,
  },
  {
    icon: <UserCircle size={28} />,
    title: "One PFP per profile",
    description: "Each Moltbook profile gets a single, unique NFT linked to their profile ID.",
    decoratorColor: "blue" as const,
    decoratorShape: "square" as const,
  },
  {
    icon: <Users size={28} />,
    title: "Humans & agents",
    description: "Built for both human users and Moltbook agents. Same identity layer for all.",
    decoratorColor: "yellow" as const,
    decoratorShape: "triangle" as const,
  },
  {
    icon: <Palette size={28} />,
    title: "Custom PFP generation",
    description: "Deterministic or trait-based design. Theme, palette, and metadata on chain.",
    decoratorColor: "red" as const,
    decoratorShape: "square" as const,
  },
  {
    icon: <Link2 size={28} />,
    title: "On-chain verification",
    description: "NFT metadata stores your Moltbook profile ID. Verifiable and portable.",
    decoratorColor: "blue" as const,
    decoratorShape: "triangle" as const,
  },
  {
    icon: <BadgeCheck size={28} />,
    title: "Verified in Moltbook",
    description: "Your PFP shows as profile picture in Moltbook with a verified identity badge.",
    decoratorColor: "yellow" as const,
    decoratorShape: "circle" as const,
  },
];

export function Features() {
  const headingRef = useRef(null);
  const isHeadingInView = useInView(headingRef, { once: true });

  return (
    <Box
      id="features"
      pt={{ base: 12, md: 20 }}
      pb={{ base: 20, md: 28 }}
      position="relative"
      bg="bauhaus.background"
    >
      <Container maxW="6xl">
        <VStack spacing={{ base: 14, md: 20 }}>
          <VStack spacing={5} ref={headingRef} w="full" align="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={isHeadingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Box position="relative" display="inline-block">
                <Heading
                  as="h2"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="normal"
                  color="bauhaus.foreground"
                  textAlign="center"
                >
                  Features
                </Heading>
                <Box
                  position="absolute"
                  left="50%"
                  bottom={{ base: "-10px", md: "-14px" }}
                  transform="translateX(-50%)"
                  w={{ base: "140px", md: "180px", lg: "220px" }}
                  h={{ base: "10px", md: "14px" }}
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
                      stroke="#F1F1F1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>
              </Box>
            </MotionBox>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }} w="full">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
