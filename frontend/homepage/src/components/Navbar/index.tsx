import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  HStack,
  Image,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { colors } from "@/theme/colors";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export enum Section {
  credential,
  why,
  team,
  faq,
}

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <header>
      <Flex
        bg={colors.white}
        color={colors.brandBlack}
        minH={"144px"}
        px={"4rem"}
        justify={"center"}
        align={"center"}
        marginBottom={"32px"}
      >
        <Flex
          flex={{ base: 1 }}
          align={"center"}
          justify={{ base: "flex-start", md: "space-between" }}
        >
          <Image alt={"logo"} src={"/assets/logo.svg"} />
          <Flex display={{ base: "none", md: "flex" }} mx={10} align={"end"}>
            <DesktopNav />
          </Flex>
        </Flex>
        <Flex align={"flex-end"} display={{ base: "flex", md: "none" }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        <Button
          as={"a"}
          display={{ base: "none", md: "inline-flex" }}
          fontSize={"xl"}
          height={"64px"}
          lineHeight={"20px"}
          fontWeight={400}
          color={"white"}
          bg={colors.brandBlue}
          borderRadius={"16px"}
          padding={"22px 32px"}
          href={"#waitlist"}
          borderWidth={"3px"}
          borderColor={"white"}
          borderStyle={"solid"}
          _hover={{
            bg: "white",
            color: colors.brandBlue,
            borderWidth: "3px",
            borderColor: colors.brandBlue,
            borderStyle: "solid",
          }}
        >
          Join Waitlist
        </Button>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </header>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue(colors.smoke, "gray.800");
  return (
    <HStack justify={"space-evenly"} w="full">
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"20px"}
                lineHeight={"20px"}
                fontWeight={500}
                color={linkColor}
                padding="22px 32px"
                _hover={{
                  textDecoration: "none",
                  backgroundColor: colors.smoke,
                  borderRadius: "16px",
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </HStack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("#f6f8ff", "gray.800");
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue(linkHoverColor, "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: linkHoverColor }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Button
        as={"a"}
        fontSize={"sm"}
        fontWeight={400}
        color={"white"}
        bg={colors.brandBlack}
        href={"#waitlist"}
        _hover={{
          bg: "#0E2865",
        }}
      >
        Request access
      </Button>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={500}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Our credentials",
    href: "#our-credentials",
  },
  {
    label: "Why socialcap?",
    href: "#why-socialcap",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "Our team",
    href: "#team",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
];
