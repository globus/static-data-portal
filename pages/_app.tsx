import "@/styles/globals.css";
import React from "react";
import Head from "next/head";
import {
  ChakraProvider,
  Link,
  Container,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import Header from "@/components/Header";
import { Provider } from "@/components/globus-auth-context/Provider";
import theme from "@/chakra-theme";
import STATIC from "@/static.json";
import TokenListener from "@/components/TokenListener";

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
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: { position: "bottom-right", duration: null },
        }}
      >
        <Provider
          redirectUri={STATIC.globus.application.redirect_uri}
          clientId={STATIC.globus.application.client_id}
          requestedScopes="openid email profile urn:globus:auth:scope:transfer.api.globus.org:all"
        >
          <TokenListener />
          <Flex direction="column" flex="1" h="100vh">
            <Header />
            <Flex as="main" role="main" direction="column" flex="1">
              <Component {...pageProps} />
            </Flex>
            <Box as="footer">
              <Container maxW="container.xl" pb={2}>
                <Flex justify="space-between">
                  <Link href="https://www.globus.org/" isExternal>
                    <Text fontSize="sm">Powered by Globus</Text>
                  </Link>
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
                </Flex>
              </Container>
            </Box>
          </Flex>
        </Provider>
      </ChakraProvider>
    </>
  );
}