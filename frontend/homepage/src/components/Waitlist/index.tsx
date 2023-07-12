import { FormEvent, ChangeEvent, useState } from "react";
import {
  Stack,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Container,
  Flex,
  Box,
  HStack,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { NextPage } from "next";
import SectionTitle from "../SectionTitle";
import { colors } from "@/theme/colors";
import SubscribeForm from "./SubscribeForm";

const Waitlist: NextPage = () => {
  return (
    <section id="waitlist">
      <Flex position="relative" justifyContent="center" direction={"column"}>
        <Container
          maxW="container.xl"
          py="4rem"
          px="4rem"
          bg={colors.brandBlue}
          my={"54px"}
          borderRadius={"16px"}
          height={"auto"}
        >
          <Stack
            color={colors.white}
            spacing={10}
            backgroundImage={{ base: "none", lg: "url(/assets/waitlist.svg)" }}
            bgSize={"536px"}
            bgRepeat={"no-repeat"}
            bgPos={{ base: "bottom 347px", lg: "right 0px" }}
          >
            <Heading as={"h2"}>Join Waitlist</Heading>
            <Text
              fontWeight={400}
              fontSize={"1.125rem"}
              lineHeight={"28px"}
              wordBreak={"break-word"}
              w={{ base: "full", lg: "50%" }}
            >
              Join the waitlist and unlock the full potential of your community
              with legitimate, trustworthy, and valuable credentials
            </Text>
            <SubscribeForm w={{ base: "full", lg: "50%" }} />
            <Image
              display={{ lg: "none" }}
              src={"/assets/waitlist-mobile.svg"}
            />
          </Stack>
        </Container>
      </Flex>
    </section>
  );
};
export default Waitlist;
