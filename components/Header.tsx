import React from "react";
import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";

import STATIC from "../static.json";

export default function Header() {
  const auth = useAuth();
  return (
    <Box as="header" bgColor="brand.700">
      <Container>
        <Flex
          minWidth="max-content"
          alignItems="center"
          justify="space-between"
          h="100%"
          p={2}
        >
          <Heading as="h1" textColor="white" fontSize="2xl">
            {STATIC.content.title}
          </Heading>
          {auth.isAuthenticated ? (
            <Button size="sm" onClick={() => auth.removeUser()}>
              Log Out
            </Button>
          ) : (
            <Button size="sm" onClick={() => auth.signinRedirect()}>
              Sign In
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
