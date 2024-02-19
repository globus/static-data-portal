import React from "react";
import { Container, Text } from "@chakra-ui/react";
import { useAuth } from "react-oidc-context";

import STATIC from "../static.json";
import DirectoryListing from "@/components/DirectoryListing";

export default function Home() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <>
        <Text fontSize="xl">It's how research data management is done!</Text>
        <Text>{STATIC.globus.client_id}</Text>
      </>
    );
  }

  return (
    <Container>
      <Text fontSize="xl">Welcome!</Text>
      <DirectoryListing />
    </Container>
  );
}
