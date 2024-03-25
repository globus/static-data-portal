import React from "react";
import { Container, Text } from "@chakra-ui/react";

import STATIC from "@/static.json";

export default function TermsAndConditions() {
  const terms = STATIC.data.attributes.content.terms_of_service;
  return (
    terms && (
      <Container p={2}>
        <Text fontSize="xl">Terms and Conditions</Text>
        <Text>{terms}</Text>
      </Container>
    )
  );
}
