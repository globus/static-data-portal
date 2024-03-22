import React from "react";
import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";

export default function Header({ title }: { title: string }) {
  const auth = useGlobusAuth();
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
          h="20vh"
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
          {auth.isAuthenticated ? (
            <Button size="sm" onClick={() => auth.authorization?.revoke()}>
              Log Out
            </Button>
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
