import React from "react";
import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { STATIC } from "@/utils/static";
import Navigation from "./Navigation";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  const isCondensed = router.pathname === "/transfer";

  const title = STATIC.data.attributes.content.title;
  const subtitle = STATIC.data.attributes.content?.subtitle;

  const image =
    STATIC.data.attributes.content.image ||
    "background-images/nasa-Q1p7bh3SHj8-unsplash.jpg";

  return (
    <Box
      as="header"
      bgImage={image}
      bgSize="cover"
      bgPosition="center"
      transition="all 300ms"
      minH={isCondensed ? "50px" : "20vh"}
    >
      <Navigation />
      {!isCondensed && (
        <Container maxW="container.xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            minWidth="max-content"
            alignItems={{ base: "flex-start", md: "center" }}
            justify={{ base: "space-around", md: "space-between" }}
          >
            <Box>
              <Heading
                as="h1"
                textColor="white"
                fontSize="3xl"
                borderRadius={4}
                py={2}
                px={4}
                backgroundColor="rgba(0,0,0,0.75)"
              >
                {title}
              </Heading>
              {subtitle && (
                <Heading
                  as="p"
                  textColor="white"
                  fontSize="md"
                  borderRadius={4}
                  my={1}
                  py={2}
                  px={4}
                  backgroundColor="rgba(0,0,0,0.75)"
                >
                  {subtitle}
                </Heading>
              )}
            </Box>
          </Flex>
        </Container>
      )}
    </Box>
  );
}
