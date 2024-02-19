import "@/styles/globals.css";
import React from "react";
import Head from "next/head";
import {
  ChakraProvider,
  Link,
  Container,
  Box,
  Flex,
  Image,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import Header from "@/components/Header";
import AuthProvider from "@/components/providers/AuthProvider";
import theme from "@/chakra-theme";
import STATIC from "@/static.json";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{STATIC.content.title}</title>
        <meta
          name="description"
          content="A Globus-powered research data portal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <Flex direction="column" flex="1" h="100vh">
            <Header />
            <Flex as="main" role="main" direction="column" flex="1">
              <Box h="20vh" w="auto">
                <Image
                  boxSize="100%"
                  src="background-images/nasa-Q1p7bh3SHj8-unsplash.jpg"
                  objectFit="cover"
                  objectPosition="center"
                  alt=""
                />
              </Box>
              <Container flex="1">
                <main>
                  <Component {...pageProps} />
                </main>
              </Container>
            </Flex>
            <Box as="footer">
              <Container>
                <Flex justify="space-between">
                  <Link href="https://www.globus.org/" isExternal>
                    Powered by Globus
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                  <div>
                    Photo by{" "}
                    <Link
                      isExternal
                      href="https://unsplash.com/@nasa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                    >
                      NASA
                      <ExternalLinkIcon mx="2px" />
                    </Link>{" "}
                    on{" "}
                    <Link
                      isExternal
                      href="https://unsplash.com/photos/photo-of-outer-space-Q1p7bh3SHj8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
                    >
                      Unsplash <ExternalLinkIcon mx="2px" />
                    </Link>
                  </div>
                </Flex>
              </Container>
            </Box>
          </Flex>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
