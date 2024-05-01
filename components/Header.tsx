import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

import { ChevronDownIcon } from "@chakra-ui/icons";

export default function Header({ title }: { title: string }) {
  const auth = useGlobusAuth();
  const user = auth.authorization?.user;

  return (
    <Box
      as="header"
      bgImage="background-images/nasa-Q1p7bh3SHj8-unsplash.jpg"
      bgSize="cover"
      bgPosition="center"
    >
      <Container maxW="container.xl">
        <Flex
          minWidth="max-content"
          alignItems="center"
          justify="space-between"
          h="10vh"
        >
          <Heading
            as="h1"
            textColor="white"
            fontSize="2xl"
            py={2}
            px={4}
            backgroundColor="rgba(0,0,0,0.75)"
          >
            {title}
          </Heading>
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
        </Flex>
      </Container>
    </Box>
  );
}
