import React from "react";
import {
  Box,
  Button,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { STATIC } from "@/utils/static";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

export type NavigationItem =
  | {
      label: string;
      to: string;
      authenticated?: boolean;
    }
  | {
      label: string;
      href: string;
      authenticated?: boolean;
    };

export type NavigationOptions = {
  items: NavigationItem[];
};

const DEFAULT_NAVIGATION: NavigationOptions = {
  items: [
    {
      label: "Transfer",
      to: "/transfer",
      authenticated: true,
    },
  ],
};

const NAVIGATION = {
  ...(STATIC.data.attributes.content.navigation || {}),
  items: [
    ...DEFAULT_NAVIGATION.items,
    ...(STATIC.data.attributes.content.navigation?.items || []),
  ],
};

const NavigationItemLink = (props: NavigationItem) => {
  if ("to" in props) {
    return (
      <Link as={NextLink} href={props.to}>
        {props.label}
      </Link>
    );
  }
  return (
    <Link href={props.href} isExternal={props.href.startsWith("http")}>
      {props.label}
    </Link>
  );
};

export default function Navigation() {
  const auth = useGlobusAuth();
  const user = auth.authorization?.user;
  const nav = NAVIGATION;
  return (
    <HStack
      justify="space-between"
      fontSize="md"
      bgGradient="linear(to-b, black, blackAlpha.600 80%, blackAlpha.50)"
    >
      <Box py={2} px={4}>
        <Link as={NextLink} href="/">
          <Text fontSize="lg" textColor="white">
            {STATIC.data.attributes.content.title}
          </Text>
        </Link>
      </Box>
      <HStack py={2} px={4}>
        <HStack as="nav" spacing={4} textColor="white">
          {nav.items
            .filter((item) => {
              if (!item.authenticated) {
                return true;
              }
              return auth.isAuthenticated;
            })
            .map((item, index) => (
              <Box key={index} fontWeight={500} p={2}>
                <NavigationItemLink {...item} />
              </Box>
            ))}
        </HStack>
        {auth.isAuthenticated && user ? (
          <Menu placement="bottom-end">
            <MenuButton
              colorScheme="gray"
              size="sm"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              {user?.preferred_username}
            </MenuButton>
            <MenuList>
              <Box px={2} textAlign="right">
                <Text>{user?.name}</Text>
                <Text fontSize="sm">{user?.organization}</Text>
              </Box>
              <MenuDivider />
              <MenuItem
                onClick={async () => await auth.authorization?.revoke()}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button size="sm" onClick={() => auth.authorization?.login()}>
            Sign In
          </Button>
        )}
      </HStack>
    </HStack>
  );
}
