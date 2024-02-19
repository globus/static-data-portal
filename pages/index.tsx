import React from "react";
import { Text } from "@chakra-ui/react";

import STATIC from "../static.json";

export default function Home() {
  return (
    <>
      <Text fontSize="xl">It's how research data management is done!</Text>
      <Text>{STATIC.globus.client_id}</Text>
    </>
  );
}
