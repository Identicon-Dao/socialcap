import { colors } from "@/theme/colors";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function Hero() {
  return (
    <Stack
      minH={"100vh"}
      align={"center"}
      backgroundImage={{
        base: "url(/assets/hero-mobile.svg)",
        lg: "url(/assets/hero.svg)",
      }}
      backgroundSize={"cover"}
      backgroundPosition={{ base: "bottom center", lg: "top center" }}
      bgRepeat="no-repeat"
    >
      <Flex
        flex={1}
        direction={"column"}
        alignContent={"center"}
        maxWidth={"610px"}
      >
        <Box w={"full"}>
          <Heading
            as={"h1"}
            wordBreak={"break-word"}
            textAlign={{ base: "center" }}
            marginTop={16}
          >
            Power up your community
          </Heading>
          <Text
            fontSize={{ base: "16px", lg: "24px" }}
            fontWeight={500}
            lineHeight={{ base: "24px", lg: "38px" }}
            wordBreak={"break-word"}
            color={colors.brandBlack}
            align={"center"}
            p={8}
          >
            Communities are the heart and soul of Web3, and Credentials are the
            new foundation for building trust and reputation within them.
          </Text>
        </Box>
        <Stack mt={{ base: 4, lg: 8 }} alignItems={"center"}>
          <Button
            fontWeight={500}
            color={colors.brandBlue}
            variant={"outline"}
            borderColor={colors.brandBlue}
            padding="22px 32px"
            borderWidth={"3px"}
            borderStyle={"solid"}
            borderRadius="16px"
            fontSize={"20px"}
            height={"64px"}
            _hover={{
              bg: colors.brandBlue,
              color: "white",
              borderWidth: "3px",
              borderColor: colors.brandBlue,
              borderStyle: "solid",
            }}
          >
            Learn more
          </Button>
        </Stack>
      </Flex>
    </Stack>
  );
}
