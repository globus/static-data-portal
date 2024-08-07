import Image from "next/image";
import {
  Link,
  Container,
  Box,
  Flex,
  Text,
  Icon,
  HStack,
} from "@chakra-ui/react";
import React, { type PropsWithChildren } from "react";
import Header from "@/components/Header";
import GlobusLogo from "@/public/icons/globus.svg";

import { STATIC } from "@/utils/static";

const hasCustomImage = STATIC.data.attributes.content.image !== undefined;

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Flex direction="column" flex="1" h="100vh">
        <Header />
        <Flex as="main" role="main" direction="column" flex="1">
          {children}
        </Flex>
        <Box as="footer">
          <Container maxW="container.xl" pb={2}>
            <Flex justify="space-between">
              <Link href="https://www.globus.org/" isExternal>
                <HStack>
                  <Text fontSize="sm">Powered by Globus</Text>{" "}
                  <Icon
                    as={Image}
                    src={GlobusLogo}
                    viewBox="0 0 256 256"
                    width="100px"
                    boxSize={6}
                    color="gray.500"
                    alt=""
                  />
                </HStack>
              </Link>
              {!hasCustomImage && (
                <Text fontSize="xs">
                  Photo by{" "}
                  <Link
                    isExternal
                    href="https://unsplash.com/@nasa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                  >
                    NASA
                  </Link>{" "}
                  on{" "}
                  <Link
                    isExternal
                    href="https://unsplash.com/photos/photo-of-outer-space-Q1p7bh3SHj8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                  >
                    Unsplash
                  </Link>
                </Text>
              )}
            </Flex>
          </Container>
        </Box>
      </Flex>
    </>
  );
}
