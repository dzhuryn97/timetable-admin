"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { FcAssistant, FcCollaboration } from "react-icons/fc";
import {NavLink} from "react-router-dom";

interface CardProps {
  heading: string;
  description: string;
  icon: ReactElement;
  href: string;
}

const Card = ({ heading, description, icon, href }: CardProps) => {
  return (
    <Box
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
    >
      <Stack align={"start"} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"full"}
          bg={useColorModeValue("gray.100", "gray.700")}
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={"sm"}>
            {description}
          </Text>
        </Box>


        <Button as={NavLink} to={href} variant={"link"} colorScheme={"blue"} size={"sm"}>
          Go ahead
        </Button>
      </Stack>
    </Box>
  );
};

export default function Home() {
  return (
    <Box p={2}>
      <Flex flexWrap="wrap" gridGap={6} justify="left">
        <Card
          heading={"Doctors"}
          icon={<Icon as={FcAssistant} w={10} h={10} />}
          description={"Managing doctors and their schedule."}
          href={"/doctor"}
        />
        <Card
          heading={"Users"}
          icon={<Icon as={FcCollaboration} w={10} h={10} />}
          description={"Managing users"}
          href={"/user"}
        />
      </Flex>
    </Box>
  );
}
